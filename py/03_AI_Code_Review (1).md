# 03 — AI Code Review Interview Practice

## How to answer code-review questions

Do not only say:

> "This code is wrong."

Say:

```text
1. What is wrong?
2. Why does it happen?
3. How can it happen?
4. What is the impact?
5. How would you fix it?
```

---

# LEVEL 1 — Race condition

## AI-generated code

```python
account = get_account(user_id)

if account.balance >= amount:
    account.balance -= amount
    save(account)
```

## Question

What can go wrong?

## Answer

Two requests can run at the same time.

Both may read:

```text
balance = 100
```

Both check:

```text
100 >= 80
```


account = (
    db.query(Account)
    .filter(Account.user_id == user_id)
    .with_for_update()
    .first()
)

Both continue.

This can cause an incorrect balance or double spending.

## Fix

Use a transaction and database locking/atomic update.

used for lock =>     .with_for_update()
in sql for lock => 

BEGIN;

SELECT *
FROM accounts
WHERE user_id = 1
FOR UPDATE;

-- check/update

UPDATE accounts
SET balance = balance - 80
WHERE user_id = 1;

COMMIT;



Example:

```sql
SELECT balance
FROM accounts
WHERE id = ?
FOR UPDATE;
```

Then check and update while the row is locked.

---

# LEVEL 2 — TOCTOU

TOCTOU = Time Of Check To Time Of Use.

## Code

```python
if file.owner_id == user.id:
    delete_file(file.id)
```

## Question

What should you think about?

## Answer

The ownership check and the delete are separate operations.

That creates a time-of-check/time-of-use risk if the authorization state can change between them, especially when the delete function performs a separate database query.

A safer approach is to put the authorization condition into the delete operation itself:

```sql
DELETE FROM files
WHERE id = ?
  AND owner_id = ?;
```

Then check whether one row was deleted. If zero rows were deleted, treat it as not found/not authorized.

---

# LEVEL 3 — Authorization only in frontend

## Code

```javascript
if (user.isAdmin) {
    showDeleteButton();
}
```

## Question

Is this security?

## Answer

No.

The frontend controls what the user sees, not what the server allows.

The server must check:

```text
Is this user allowed to delete this resource?
```

---

# LEVEL 4 — IDOR - full form => Insecure Direct Object Reference

## Endpoint

```http
GET /users/100/orders
```

Code:

```python
orders = Order.query.filter_by(user_id=user_id).all()
```

## Problem

The authenticated user can request:

```http
GET /users/101/orders
```

and see another user's orders.

## Fix

Use the authenticated user's identity or explicitly authorize ownership:

```python
if requested_user_id != current_user.id:
    raise Forbidden()
```

Better still, query directly using the authenticated identity.

---

# LEVEL 5 — Duplicate payment

## Code

```python
def pay(order_id, amount):
    charge_card(amount)
    mark_order_paid(order_id)
```

```python
def pay(order_id, amount):
    # Generate an idempotency key
     idempotency_key = str(uuid4())

    # Check if this key already exists
    existing = IdempotencyStore.get(idempotency_key)
    if existing:
        return existing.result

    # Perform the operation
    charge_card(amount)
    mark_order_paid(order_id)

    # Store the result
    IdempotencyStore.set(idempotency_key, result)

    return result
```

## Question

What happens if the client retries the request?

## Answer

The card can be charged twice.

## Fix

Use idempotency.

For example:

```text
idempotency_key
```

Store the result for that key.

If the same request arrives again, return the previous result instead of charging again.

---

# LEVEL 6 — Database transaction missing

## Code

```python
create_order()
charge_card()
send_confirmation_email()
```

## Question

Should all three be one database transaction?

## Answer

Not necessarily.

Database operations should be transactional where needed.

External calls such as card charging/email cannot simply be rolled back by a database rollback.

A robust design may use:

```text
DB transaction
↓
save order/payment state + outbox event
↓
commit
↓
background worker reads outbox
↓
external action
```

For payments, the payment provider's idempotency mechanism should also be used where supported.

---

# LEVEL 7 — Check then insert

## Code

```python
if not user_exists(email):
    create_user(email)
```

## Question

Can duplicate users still happen?

## Answer

Yes.

Two requests can both see:

```text
user does not exist
```

and both insert.

## Fix

Use a database unique constraint:

```sql
UNIQUE(email)
```

The database should enforce the rule.

Application checks are useful, but constraints provide the final protection.

---

# LEVEL 8 — Inventory race

## Code

```python
product = get_product(id)

if product.stock > 0:
    product.stock -= 1
    save(product)
```

## Problem

Two buyers can both see stock = 1.

Both buy the last item.

## Fix

Use an atomic database operation:

```sql
UPDATE products
SET stock = stock - 1
WHERE id = ?
  AND stock > 0;
```

Then check the affected row count.

---

# LEVEL 9 — Permission check on wrong object

## Code

```python
if user.company_id == project.owner_id:
    return project
```

## Question

What is suspicious?

## Answer

`company_id` is being compared to `owner_id`.

Those may represent different things.

The developer should verify the data model.

Correct authorization might be:

```python
project.company_id == user.company_id
```

The lesson:

> Never assume two IDs mean the same thing.

---

# LEVEL 10 — Mass assignment

## Code

```python
user.update(request.json)
```

The request contains:

```json
{
  "name": "John",
  "is_admin": true
}
```

## Problem

The user may update fields they should not control.

## Fix

Allow only expected fields:

```python
allowed = {
    "name",
    "phone"
}
```

Never blindly copy user input into sensitive model fields.

---

# LEVEL 11 — Race condition with coupon

## Code

```python
if coupon.remaining > 0:
    coupon.remaining -= 1
    save(coupon)
```

## Problem

Many users can use the final coupon at the same time.

## Fix

Use:

- an atomic update, or
- a transaction with row locking, or
- another concurrency-safe design

The important part is that "check + decrease" must behave as one safe operation.

---

# LEVEL 12 — Delete without ownership

## Code

```python
DELETE FROM documents
WHERE id = ?
```

## Problem

The API checks that the document exists but not that the current user owns it.

## Fix

Include authorization:

```sql
DELETE FROM documents
WHERE id = ?
  AND company_id = ?;
```

---

# LEVEL 13 — Stale object

## Scenario

Request A reads:

```text
version = 5
```

Request B updates the record to:

```text
version = 6
```

Request A later saves its old data.

## Problem

Request A can overwrite B's newer changes.

## Fix

Use optimistic locking:

```sql
UPDATE documents
SET content = ?, version = version + 1
WHERE id = ?
  AND version = 5;
```

If zero rows are updated, the data changed and the request must be retried or rejected.

---

# LEVEL 14 — AI-generated permission bug

## Code

```python
def get_invoice(invoice_id, user):
    invoice = db.get(Invoice, invoice_id)

    if invoice:
        return invoice
```

## Question

What is missing?

## Answer

Authorization.

It only checks existence.

A safer version checks ownership:

```python
invoice = db.query(Invoice).filter(
    Invoice.id == invoice_id,
    Invoice.company_id == user.company_id
).first()
```

Then return the invoice only if the authorized query finds it.

---

# LEVEL 15 — Background job permission bug

## Code

```python
def process_export(export_id):
    export = get_export(export_id)
    send_file(export.file_url)
```

## Question

What should you inspect?

## Answer

The worker may run with powerful permissions.

Check:

```text
Who created the export?
Which company owns it?
Can the export ID be guessed?
Can a user request another company's export?
Does the worker trust user-controlled IDs?
```

A background job is still part of the security boundary.

---

# LEVEL 16 — Webhook replay

## Scenario

A payment provider sends:

```text
payment_succeeded
```

The server processes it.

An attacker sends the same webhook again.

## Problem

The payment may be processed twice.

## Fix

Use:

```text
event_id
```

and store processed events.

If an event ID was already processed:

```text
do nothing / return success
```

Also verify the webhook signature.

---

# LEVEL 17 — Database constraint vs application check

## Code

```python
if not email_exists(email):
    create_user(email)
```

## Interview question

"Is this enough?"

## Answer

No.

The application check has a race condition.

Use:

```sql
UNIQUE(email)
```

Then handle the duplicate error.

Strong interview sentence:

> "Business rules that must always be true should be enforced at the database level when possible."

---

# LEVEL 18 — Full AI PR review

## AI-generated code

```python
def transfer(from_id, to_id, amount):
    sender = db.get(Account, from_id)
    receiver = db.get(Account, to_id)

    if sender.balance >= amount:
        sender.balance -= amount
        receiver.balance += amount

        db.commit()
        return True

    return False
```

## Find the problems

### Problem 1 — Authorization

Who is allowed to transfer money from `from_id`?

The function accepts an account ID directly.

A user might try another account.

### Problem 2 — Concurrency

Two transfers can read the same sender balance.

Need transaction/locking or an atomic approach.

### Problem 3 — Validation

Check:

```text
amount > 0
from_id != to_id
account exists
account is active
```

### Problem 4 — Atomicity

Both accounts must update together.

A transaction is required.

### Problem 5 — Database constraints

Consider constraints so balances cannot become invalid.

---

# FINAL MOCK PR

## AI-generated code

```python
def update_project(project_id, data, user):
    project = db.get(Project, project_id)

    if not project:
        return None

    if project.company_id != user.company_id:
        return None

    project.name = data["name"]
    project.company_id = data.get(
        "company_id",
        project.company_id
    )

    db.commit()
    return project
```

## Your task

Find everything wrong.

## Strong answer

### Bug 1 — Tenant can be changed

The user is allowed to send:

```json
{
    "company_id": 20
}
```

The code checks that the old project belongs to company 10, then changes the project to company 20.

This can move data across tenants.

A strong fix is to never allow normal users to change `company_id`, and enforce the tenant rule at the database level with an appropriate `WITH CHECK` policy.

### Bug 2 — Race/concurrency

If other operations can update the same project at the same time, we need to think about stale updates and possibly optimistic locking.

### Bug 3 — Authorization should be enforced by the database too

The Python check protects this endpoint, but another endpoint may forget it.

Database-level tenant isolation is safer.

### Bug 4 — Input control

`data` should be validated.

Users should not be allowed to change fields they do not own.

---

# Interview answer template

When reviewing AI-generated code, use this:

> "The happy path works, but there is a security/concurrency problem."

Then explain:

```text
1. Attacker/user action
2. Exact line causing the problem
3. What happens
4. Real-world impact
5. Correct fix
6. How I would test it
```

Example:

> "The code checks the balance before updating it. Two requests can read the same balance before either update is committed. Both can pass the check. I would put the operation inside a transaction and lock the account row, or use an atomic conditional update."

---

# Final checklist

Before saying AI code is correct, check:

```text
AUTHORIZATION
- Can the user access this object?
- Can they change another user's data?
- Can they change tenant/company IDs?

CONCURRENCY
- What if two requests run together?
- Is check + update atomic?
- Do we need a lock/version?

DATABASE
- Are important rules enforced by constraints?
- Is there a transaction?
- Can partial updates happen?

INPUT
- Are all fields allowed?
- Can users modify sensitive fields?

RETRIES
- What if the request is sent twice?
- Do we need idempotency?

BACKGROUND JOBS
- Does the worker have too much permission?

TESTING
- Test two simultaneous requests
- Test another user's ID
- Test another company's ID
- Test duplicate request
- Test stale data
```

# The key mindset

AI-generated code often looks correct because it handles the normal case.

Your job in the interview is to ask:

> "What happens if two requests happen at the same time?"

> "What happens if the user changes this ID?"

> "What happens if the request is repeated?"

> "What happens if this object belongs to another company?"

> "What happens if the database changes between these two lines?"

Those questions will help you find subtle bugs.
