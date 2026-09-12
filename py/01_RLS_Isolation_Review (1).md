TENANT
  ↓
Company A
Company B
Company C

RLS
  ↓
Controls which rows each company can see/use

CREATE POLICY project_read
ON projects
FOR SELECT
USING (company_id = current_company_id());


# 01 — RLS / Data Isolation Interview Practice

This is a PostgreSQL Row-Level Security (RLS) policy:

## How to use this file

For every problem:
1. Read the setup.
2. Try to find the leak yourself.
3. Explain your thinking out loud.
4. Only then read the answer.

---

# LEVEL 1 — Basic tenant isolation

## Scenario

A SaaS app has companies. Each company must only see its own projects.

```sql
companies
---------
id
name

projects
--------
id
company_id
name
```

Current policy:

```sql
CREATE POLICY project_read
ON projects
FOR SELECT
USING (company_id = current_company_id());
```

| id | company_id | name      |
| -: | ---------: | --------- |
|  1 |         10 | Project A |
|  2 |         10 | Project B |
|  3 |         20 | Project C |
|  4 |         20 | Project D |


> Note: `current_company_id()` is an example helper function. In a real system, the important part is that the value comes from a trusted database session/authentication context.

## Questions

1. What does this policy do?
2. What must `current_company_id()` return?
3. What happens if the application lets a user change the company ID sent to the database?
4. What is the main security rule here?

## Expected answer


1. What does this policy do?
It controls SELECT access on the projects table. A user can only see projects belonging to their company.

2. What must current_company_id() return?

It must return the authenticated user's trusted company ID. For example, if the user belongs to company 10, it should return 10.

3. What happens if the application lets a user change the company ID sent to the database?

That's a security problem. A user could try to set the company ID to another company and access its data. The company ID used by the policy must come from a trusted authentication/session context, not normal request input.

4. What is the main security rule?

Never trust the company/tenant ID supplied directly by the user. The database should get it from a trusted identity.
---

# LEVEL 2 — JOIN leak

## Scenario

```sql
documents
---------
id
company_id
title

document_comments
-----------------
id
document_id
comment
```

`documents` has correct RLS.

`document_comments` has no RLS.

An API allows:

```sql
SELECT *
FROM document_comments
WHERE document_id = ?;
```

## Question

Can this leak data?

## Answer

Yes.

Even though `documents` is protected, comments are a separate table. A user may guess another company's `document_id` and directly read its comments.

The fix is to protect the comments table too.

Example:

```sql
CREATE POLICY comment_read
ON document_comments
FOR SELECT
USING (
    EXISTS (
        SELECT 1
        FROM documents d
        WHERE d.id = document_comments.document_id
          AND d.company_id = current_company_id()
    )
);
```

## Interview sentence

> "I don't only check the parent table. I check every table that contains protected data."

---

# LEVEL 3 — USING vs WITH CHECK

## Scenario

```sql
CREATE POLICY project_update
ON projects
FOR UPDATE
USING (company_id = current_company_id());
```

A user from company 10 owns project 5.

The user sends:

```sql
UPDATE projects
SET company_id = 20
WHERE id = 5;
```

## Question

Why should we also think about `WITH CHECK`?

## Answer

`USING` controls which existing rows can be targeted.

`WITH CHECK` controls whether the new row is allowed after INSERT/UPDATE.

A safer policy is:

```sql
CREATE POLICY project_update
ON projects
FOR UPDATE
USING (company_id = current_company_id())
WITH CHECK (company_id = current_company_id());
```

This prevents a company 10 user from moving a row into company 20.

## Remember

- `USING` → "Can I access this existing row?"
- `WITH CHECK` → "Is the new row allowed?"

---

# LEVEL 4 — INSERT bug

## Scenario

```sql
CREATE POLICY project_insert
ON projects
FOR INSERT
WITH CHECK (company_id = current_company_id());
```

The API accepts:

```json
{
  "name": "Secret Project",
  "company_id": 20
}
```

The logged-in user belongs to company 10.

## Question

Can they insert into company 20?

## Answer

No, if RLS is enabled and this policy is actually applied to the INSERT.

The database compares `company_id` with the trusted current company.

This is exactly why `WITH CHECK` is important.

---

# LEVEL 5 — SECURITY DEFINER function

## Scenario

A function is created like this:

```sql
CREATE FUNCTION get_document(doc_id bigint)
RETURNS documents
SECURITY DEFINER
AS $$
    SELECT *
    FROM documents
    WHERE id = doc_id;
$$;
```

The API lets normal users call this function.

## Question

Why is this dangerous?

## Answer

`SECURITY DEFINER` means the function runs with the privileges of its owner.

That can create a path around normal user permissions and can interact with RLS in ways that depend on the database and function owner.

The interviewer wants you to say:

> "I would inspect the function owner, RLS behavior, search path, and exactly what privileges the function has."

Do not assume that a `SECURITY DEFINER` function is automatically safe. Check the database's exact RLS behavior, function owner, privileges, `search_path`, and what the function exposes.

---

# LEVEL 6 — Admin/service role bypass

## Scenario

The application has:

```text
normal user → normal database role
background worker → service/admin role
```

The service role can read every company.

The web API accidentally uses the service role for normal user requests.

## Question

What is the problem?

## Answer

The database sees the powerful service identity, not the real user's limited identity.

RLS may therefore be bypassed.

The fix is to use a limited database identity for user requests and keep service/admin access only for trusted backend jobs.

---

# LEVEL 7 — Hidden path through a view

## Scenario

A protected table is:

```sql
employees
---------
id
company_id
salary
```

But the API reads:

```sql
SELECT * FROM employee_summary;
```

`employee_summary` is a view.

## Question

What do you inspect?

## Answer

Do not stop at the base table.

Inspect:

- How the view is defined
- Which tables it reads
- View security behavior
- Owner/privileges
- Whether the caller can access the view
- Whether the view can expose rows that should be hidden


<!-- SELECT pg_get_viewdef('harsha'::regclass, true); -->


The key idea:

> "A secure table does not automatically mean every derived object is secure."

---

# LEVEL 8 — ID guessing

## Scenario

The API uses:

```http
GET /documents/1001
```

The developer says:

> "IDs are hard to guess because users normally don't know them."

## Question

Is this security?

## Answer

No.

Authorization must happen in the database/query. An attacker can try:

```text
1000
1001
1002
1003
...
```

Use RLS or another trusted authorization check so guessing an ID does not reveal another tenant's data.

---

# LEVEL 9 — Update ownership

## Scenario

A user can update:

```sql
UPDATE projects
SET name = 'new name'
WHERE id = 100;
```

There is a SELECT policy but no UPDATE policy.

## Question

What should you investigate?

## Answer

RLS is operation-specific.

Check:

- SELECT
- INSERT
- UPDATE
- DELETE

Do not assume a SELECT policy protects UPDATE.

Also check both the old row and the new values.

---

# LEVEL 10 — Delete leak

## Scenario

A user cannot SELECT another company's project, but the database has:

```sql
CREATE POLICY project_delete
ON projects
FOR DELETE
USING (true);
```

## Question

What can happen?

## Answer

The user may be able to delete rows they cannot read.

That is still a serious isolation problem.

A safer rule is:

```sql
USING (company_id = current_company_id())
```

---

# LEVEL 11 — Foreign key path

## Scenario

```sql
orders
------
id
company_id

order_items
-----------
id
order_id
product_id
```

`orders` has RLS.

`order_items` does not.

The API returns order items by `order_id`.

## Question

Can another company read data?

## Answer

Yes.

A foreign key is a data relationship, not an authorization rule. The child table still needs its own authorization/RLS logic if users can access it directly.

Protect `order_items` based on the company that owns its parent order.

---

# LEVEL 12 — Cross-tenant INSERT

## Scenario

A user owns a project in company 10.

They send:

```sql
INSERT INTO project_members(project_id, user_id)
VALUES (500, 99);
```

Project 500 belongs to company 20.

## Question

What must the policy check?

## Answer

It must check the ownership of the referenced project, not just the new user's identity.

For example:

```sql
EXISTS (
    SELECT 1
    FROM projects p
    WHERE p.id = project_members.project_id
      AND p.company_id = current_company_id()
)
```

---

# LEVEL 13 — The "looks secure" API

## Code

```python
@app.get("/projects/{project_id}")
def get_project(project_id, user):
    project = db.query(Project).filter(
        Project.id == project_id
    ).first()

    if not project:
        return None

    if project.company_id != user.company_id:
        return None

    return project
```

## Question

Is this enough?

## Answer

It is better than no check, but database-level isolation is stronger.

You also need to consider:

- Other endpoints
- Other tables
- Background jobs
- Direct database access
- Admin roles
- Updates
- Deletes
- Functions/views
- Race conditions

The interviewer wants system-wide thinking.

---

# LEVEL 14 — Live review checklist

When given a schema and policies, say this:

```text
1. What is the security boundary?
2. Where does the trusted user/tenant identity come from?
3. Which tables contain tenant data?
4. Does every sensitive table have protection?
5. Can data be reached through JOINs?
6. What about views?
7. What about functions?
8. What about INSERT?
9. What about UPDATE?
10. What about DELETE?
11. Can ownership/tenant_id be changed?
12. Can a service/admin role bypass this?
13. Can IDs be guessed?
14. Are foreign-key child tables protected?
15. Can another API path reach the same data?
```

LEVEL 14 — Answers

1. What is the security boundary?

"The security boundary is the tenant or company. One company should never be able to access another company's data."

2. Where does the trusted user/tenant identity come from?

"It should come from trusted authentication or session context. We should not trust a tenant ID directly from the request body or URL."

3. Which tables contain tenant data?

"I will identify tables containing tenant_id, company_id, organization_id, or relationships to tenant-owned data."

4. Does every sensitive table have protection?

"I will verify that every tenant-owned table has the correct RLS policy. Protecting only the main table is not enough."

5. Can data be reached through JOINs?

"Yes, so I will check all joined tables. If one sensitive table is not protected, a JOIN could create a data leak."

6. What about views?

"I will inspect the view definition, its owner and permissions, and check whether the underlying data is properly isolated. I won't assume a view is automatically safe."

7. What about functions?

"I will check whether functions access tenant data and especially look for SECURITY DEFINER, because a function with elevated privileges can create an authorization bypass if it is badly designed."

8. What about INSERT?

"I need to make sure a user cannot insert a row belonging to another tenant. I would use WITH CHECK to validate the tenant ID of the new row."

Example:

WITH CHECK (company_id = current_company_id())

9. What about UPDATE?

"I need to verify both which rows the user can update and what values they can change them to."

10. What about DELETE?

"The user should only be able to delete rows belonging to their own tenant."

11. Can ownership/tenant_id be changed?

"This is important. A user from Company A should not be able to update a record and change its company_id to Company B."

Example attack:

UPDATE projects
SET company_id = 20
WHERE id = 100;

12. Can a service/admin role bypass this?

"Yes, potentially. I will check which database role the application uses and whether that role can bypass RLS. RLS does not automatically mean every database role is restricted."

13. Can IDs be guessed?

"Even if IDs are predictable, authorization must prevent access to another tenant's records. UUIDs can make guessing harder, but they are not a replacement for authorization."

14. Are foreign-key child tables protected?

"I will check child tables too. Protecting projects but not project_files, for example, could still allow another tenant's files to be accessed."

15. Can another API path reach the same data?

"I will check all possible access paths, such as search, reports, exports, dashboards, APIs, views, functions, and background jobs."

⭐ Best final answer in an interview

If they ask you to review the whole schema, say:

"First, I'll identify the security boundary and determine where the trusted tenant identity comes from. Then I'll identify every tenant-owned table and check RLS for SELECT, INSERT, UPDATE, and DELETE. I'll also trace indirect access through JOINs, views, functions, and foreign-key child tables. Finally, I'll check privileged roles, predictable IDs, tenant ownership changes, and other API paths that could access the same data."

---

# FINAL MOCK INTERVIEW

## Given

```sql
projects
--------
id
company_id
name

tasks
-----
id
project_id
title

task_notes
----------
id
task_id
note
```

Policies:

```sql
-- projects
USING (company_id = current_company_id())

-- tasks
USING (
    project_id IN (
        SELECT id
        FROM projects
        WHERE company_id = current_company_id()
    )
)

-- task_notes
NO POLICY
```

## Interview question

"Find the isolation problem."

## Strong answer

`projects` is protected.

`tasks` is also protected through its project.

But `task_notes` has no policy.

If the application allows a user to request a note by `task_id`, they may access notes belonging to another company's task.

I would add a policy to `task_notes` that checks the task's project and then the project's company.

Then I would test:

```text
Company A → own project → own task → own note     PASS
Company A → Company B project                    BLOCK
Company A → Company B task                       BLOCK
Company A → Company B note                       BLOCK
Company A → insert note into B's task            BLOCK
Company A → move task to B's project             BLOCK
```

That is the type of reasoning you should show in the live interview.


---

# PRODUCTION DATABASE SECURITY ADD-ON

# LEVEL 15 — Audit logging

## Scenario

The company wants to know:

```text
Who viewed this customer's data?
Who changed it?
When did it happen?
What changed?
```

## Question

Is RLS enough?

## Answer

No.

RLS controls **who can access rows**. Audit logging answers **what happened and who did it**.

A production system may record:

```text
user_id
company_id
action
resource_type
resource_id
timestamp
old_value / changed fields
request_id
```

Do not put sensitive data into logs unless it is really needed.

---

# LEVEL 16 — Audit log must not become a leak

## Scenario

You create:

```sql
audit_logs
----------
id
company_id
user_id
action
details
```

But the audit table has no protection.

## Question

Is that safe?

## Answer

Not automatically.

Audit logs can contain sensitive information from many tenants.

The same isolation rules must be considered for audit data.

For example:

```text
Company A user → only Company A audit records
Company B user → only Company B audit records
Security admin → broader access only when explicitly allowed
```

---

# LEVEL 17 — Defending the isolation guarantee

## Interview question

"How can you prove that Company A cannot read Company B's data?"

## Strong answer

I would not say:

> "Because the API checks the company ID."

I would say:

> "I want the database to enforce the tenant boundary. I would test every direct and indirect path to the data."

Then check:

```text
SELECT
INSERT
UPDATE
DELETE
JOINs
foreign-key child tables
views
functions
background jobs
admin/service roles
exports
search/retrieval
audit logs
```

Then run negative tests:

```text
Company A → Company B row → BLOCKED
Company A → Company B child row → BLOCKED
Company A → Company B update → BLOCKED
Company A → Company B delete → BLOCKED
Company A → Company B insert/reference → BLOCKED
```

---

# LEVEL 18 — Defense in depth

A strong production design does not depend on one check.

Example:

```text
Authentication
      ↓
Application authorization
      ↓
Database RLS
      ↓
Database constraints
      ↓
Audit logging
      ↓
Security tests/monitoring
```

If one layer has a bug, another layer can reduce the impact.

---

# LEVEL 19 — Isolation testing

## Question

How would you test tenant isolation?

## Answer

Create test users:

```text
User A → Company A
User B → Company B
```

Create data:

```text
A1 → Company A
B1 → Company B
```

Then test:

```text
A reads A1 → PASS
A reads B1 → BLOCK
B reads B1 → PASS
B reads A1 → BLOCK
```

Also test:

```text
JOIN
INSERT
UPDATE
DELETE
IDs that belong to another company
child records
views
functions
background jobs
```

This should become automated security tests, not only a manual test.

---

# LEVEL 20 — Production security mock interview

## Interviewer

"Your API has a tenant check. Why do you still need RLS?"

## Strong answer

> "Application checks are useful, but they depend on every endpoint being written correctly. RLS puts the tenant boundary closer to the data. Even if an endpoint forgets an application-level check, the database can still block cross-tenant rows."

## Interviewer

"What if a service role bypasses RLS?"

## Strong answer

> "Then I would make sure that role is never used for normal user requests. Powerful roles should be limited to trusted backend operations."

## Interviewer

"Can a foreign key protect tenant isolation?"

## Strong answer

> "No. A foreign key protects referential integrity. It does not decide whether a user is allowed to see the referenced row."

## Interviewer

"How do you know your RLS policy is correct?"

## Strong answer

> "I test both positive and negative cases and trace every path to the data, including child tables, joins, views, functions, background jobs, and privileged roles."

---

# Database-security mental model

Always think:

```text
WHO is the user?
      ↓
WHICH tenant do they belong to?
      ↓
WHAT data are they trying to access?
      ↓
WHAT path reaches that data?
      ↓
WHAT policy protects that path?
      ↓
CAN they read/change/delete it?
      ↓
CAN another path bypass the policy?
      ↓
IS the action recorded when needed?
```
