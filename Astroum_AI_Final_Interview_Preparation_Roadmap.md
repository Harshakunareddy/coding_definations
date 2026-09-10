# Astroum AI --- Final Interview Preparation Roadmap

This roadmap is designed for the Astroum AI final interview. Follow it
**one topic at a time**. The order is intentional: first learn FastAPI
fundamentals, then PostgreSQL, then the AI/RAG topics and interview
exercises from the job description.

------------------------------------------------------------------------

# PHASE 1 --- Python + FastAPI Fundamentals

## 1. Python Basics Required for FastAPI

Learn only the Python concepts needed to understand backend code.

-   Variables and data types
-   Lists, tuples, sets, dictionaries
-   Functions
-   `*args` and `**kwargs`
-   Classes and objects
-   Inheritance
-   Modules and imports
-   Exceptions: `try`, `except`, `finally`
-   `async` / `await`
-   Virtual environments
-   `pip`
-   Type hints

**Interview goal:** Be able to read and modify normal Python backend
code without getting stuck on syntax.

------------------------------------------------------------------------

## 2. What Is FastAPI?

FastAPI is a modern Python web framework used to build APIs.

Important characteristics:

-   Python-based
-   Built around type hints
-   Automatic request validation
-   Automatic API documentation
-   Supports asynchronous programming
-   Commonly used for REST APIs and AI/ML backends

Know these terms:

-   API
-   REST API
-   Endpoint
-   Request
-   Response
-   JSON
-   HTTP methods

------------------------------------------------------------------------

## 3. FastAPI vs Node.js / Express

Understand the equivalent concepts rather than memorizing differences.

  Concept              Node.js / Express             FastAPI
  -------------------- ----------------------------- --------------------
  Language             JavaScript / TypeScript       Python
  Framework            Express                       FastAPI
  Route                `app.get()`                   `@app.get()`
  Request validation   Joi/Zod/manual                Pydantic
  Async                `async/await`                 `async/await`
  Middleware           Express middleware            FastAPI middleware
  ORM                  Sequelize/Prisma/TypeORM      SQLAlchemy
  Migration            Sequelize/Prisma migrations   Alembic
  API docs             Swagger setup                 Automatic
  Main server          Node.js                       Uvicorn/ASGI

**Interview point:** FastAPI itself is a framework, while Node.js is a
JavaScript runtime. Express is the closer comparison to FastAPI.

------------------------------------------------------------------------

## 4. Create a FastAPI Project

Learn:

-   Installing Python
-   Creating a virtual environment
-   Installing FastAPI
-   Installing Uvicorn
-   Running the application
-   Project structure

Typical commands:

``` bash
python -m venv venv
pip install fastapi uvicorn
uvicorn main:app --reload
```

Understand what `main:app` means.

------------------------------------------------------------------------

## 5. First FastAPI Route

Learn:

-   Creating the FastAPI application
-   GET endpoint
-   Returning JSON
-   Path operation decorators

Example:

``` python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Hello World"}
```

Understand:

-   `app = FastAPI()`
-   `@app.get("/")`
-   Function
-   JSON response

------------------------------------------------------------------------

## 6. HTTP Methods

Learn all common CRUD methods:

-   GET --- read
-   POST --- create
-   PUT --- replace/update
-   PATCH --- partial update
-   DELETE --- delete

Example API:

``` text
GET     /users
GET     /users/10
POST    /users
PUT     /users/10
PATCH   /users/10
DELETE  /users/10
```

------------------------------------------------------------------------

## 7. Path Parameters

Example:

``` python
@app.get("/users/{user_id}")
def get_user(user_id: int):
    return {"id": user_id}
```

Understand:

-   What `{user_id}` means
-   Type conversion
-   Validation
-   Difference between path and query parameters

------------------------------------------------------------------------

## 8. Query Parameters

Example:

``` python
@app.get("/users")
def get_users(limit: int = 10, page: int = 1):
    return {
        "limit": limit,
        "page": page
    }
```

Learn:

-   Optional parameters
-   Default values
-   Filtering
-   Pagination parameters

------------------------------------------------------------------------

## 9. Request Body

Understand how POST/PUT requests receive JSON.

Example request:

``` json
{
    "name": "Harsha",
    "email": "harsha@example.com"
}
```

Learn how FastAPI converts this request into a Python object.

------------------------------------------------------------------------

# PHASE 2 --- Pydantic, Validation and API Structure

## 10. Pydantic Models

Pydantic is heavily used by FastAPI for data validation and
serialization.

Example:

``` python
from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str
    age: int
```

Understand:

-   Schema
-   Validation
-   Serialization
-   Type hints
-   Required vs optional fields

------------------------------------------------------------------------

## 11. Request Schema vs Database Model

Very important distinction.

``` text
Pydantic Schema
      ↓
Validates API input

SQLAlchemy Model
      ↓
Represents database table
```

Do not confuse these two.

------------------------------------------------------------------------

## 12. Response Models

Learn how to control what your API returns.

Example:

``` python
@app.get("/users/{id}", response_model=UserResponse)
def get_user(id: int):
    ...
```

Understand why response models are useful for:

-   Validation
-   Consistent API responses
-   Hiding sensitive fields
-   Documentation

------------------------------------------------------------------------

## 13. Dependency Injection

FastAPI has a powerful dependency system.

Learn:

-   `Depends()`
-   Reusable dependencies
-   Database session dependency
-   Authentication dependency
-   Current-user dependency

Example concept:

``` text
Request
  ↓
Authentication dependency
  ↓
Database dependency
  ↓
Route
```

------------------------------------------------------------------------

## 14. Middleware

Understand what middleware does.

Common uses:

-   Logging
-   Authentication-related processing
-   CORS
-   Request timing
-   Headers
-   Error handling

Compare it with Express middleware.

------------------------------------------------------------------------

## 15. Exception Handling

Learn:

-   `HTTPException`
-   HTTP status codes
-   Custom exception handlers
-   Proper API error responses

Example:

``` python
from fastapi import HTTPException

raise HTTPException(
    status_code=404,
    detail="User not found"
)
```

Know common codes:

``` text
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Validation Error
500 Internal Server Error
```

------------------------------------------------------------------------

# PHASE 3 --- FastAPI CRUD Project

## 16. Build a Complete CRUD API

Build a small:

**User Management API**

Features:

-   Create user
-   Get all users
-   Get one user
-   Update user
-   Delete user
-   Validation
-   Error handling
-   Pagination

Suggested structure:

``` text
app/
├── main.py
├── routers/
│   └── users.py
├── schemas/
│   └── user.py
├── models/
│   └── user.py
├── services/
│   └── user_service.py
└── database.py
```

------------------------------------------------------------------------

# PHASE 4 --- MVC / Architecture in FastAPI

## 17. Does FastAPI Have MVC?

FastAPI does not force a Laravel-style MVC structure.

You can organize the application using:

``` text
Router
Controller/Service
Schema
Model
Repository
Database
```

A common flow is:

``` text
Request
   ↓
Router
   ↓
Service
   ↓
Repository / ORM
   ↓
PostgreSQL
```

Learn why separating responsibilities makes large applications easier to
maintain.

------------------------------------------------------------------------

## 18. FastAPI vs Laravel Architecture

Map your existing knowledge:

  Laravel          FastAPI
  ---------------- -----------------------------------------
  Route            Router
  Controller       Service / route handler
  Form Request     Pydantic schema
  Eloquent Model   SQLAlchemy model
  Eloquent ORM     SQLAlchemy ORM
  Middleware       Middleware
  Migration        Alembic
  `.env`           `.env` / settings
  Blade            Usually separate frontend such as React
  Artisan          CLI tools / Alembic / Python tooling

This comparison will make FastAPI much easier to learn.

------------------------------------------------------------------------

# PHASE 5 --- PostgreSQL

## 19. PostgreSQL Fundamentals

Learn:

-   Database
-   Schema
-   Table
-   Row
-   Column
-   Primary key
-   Foreign key
-   Unique constraint
-   NOT NULL
-   CHECK constraint
-   DEFAULT

------------------------------------------------------------------------

## 20. SQL CRUD

Practice:

``` sql
SELECT
INSERT
UPDATE
DELETE
```

Then practice:

``` sql
WHERE
ORDER BY
LIMIT
OFFSET
GROUP BY
HAVING
```

------------------------------------------------------------------------

## 21. Joins

Know:

-   INNER JOIN
-   LEFT JOIN
-   RIGHT JOIN
-   FULL OUTER JOIN

Be able to explain when each is useful.

------------------------------------------------------------------------

## 22. Indexes

Understand:

-   What an index is
-   Why indexes improve reads
-   Why indexes have storage/write costs
-   Composite indexes
-   When an index may not help

Example:

``` sql
CREATE INDEX idx_users_email
ON users(email);
```

------------------------------------------------------------------------

## 23. Transactions

Learn:

``` text
BEGIN
COMMIT
ROLLBACK
```

Understand **ACID**:

-   Atomicity
-   Consistency
-   Isolation
-   Durability

------------------------------------------------------------------------

## 24. PostgreSQL Performance

Learn the basics of:

``` sql
EXPLAIN
EXPLAIN ANALYZE
```

Understand:

-   Sequential scan
-   Index scan
-   Query planning
-   Slow queries
-   N+1 query problem
-   Connection pooling

------------------------------------------------------------------------

# PHASE 6 --- SQLAlchemy + Alembic

## 25. SQLAlchemy

Learn:

-   Engine
-   Session
-   Models
-   Queries
-   Relationships
-   Transactions
-   Connection pooling

Map it mentally:

``` text
Laravel Eloquent
      ≈
SQLAlchemy ORM
```

------------------------------------------------------------------------

## 26. Relationships

Practice:

-   One-to-one
-   One-to-many
-   Many-to-many

Example:

``` text
User
 └── Posts
```

Understand foreign keys and relationship loading.

------------------------------------------------------------------------

## 27. Alembic

Alembic is commonly used for database migrations in Python projects.

Learn:

-   Creating migrations
-   Applying migrations
-   Rolling back migrations
-   Schema changes

------------------------------------------------------------------------

# PHASE 7 --- Multi-Tenancy + PostgreSQL RLS

## 28. What Is Multi-Tenancy?

A multi-tenant application serves multiple organizations/customers from
the same system.

Example:

``` text
Company A
 ├── Users
 └── Documents

Company B
 ├── Users
 └── Documents
```

Company A must never see Company B's data.

------------------------------------------------------------------------

## 29. Row-Level Security (RLS)

This is **very important for the Astroum role**.

PostgreSQL RLS lets the database enforce which rows a user can access.

Concept:

``` text
User
 ↓
Tenant ID
 ↓
PostgreSQL RLS Policy
 ↓
Only allowed rows
```

Learn:

-   Enable RLS
-   Create policies
-   `USING`
-   `WITH CHECK`
-   Tenant isolation
-   Database-level security

------------------------------------------------------------------------

## 30. Multi-Tenant RLS Exercise

Be able to solve:

> Tenant A requests `/documents`. Return only Tenant A's documents, even
> if the application accidentally forgets a tenant filter.

Think about:

``` text
Application security
+
Database security
=
Defense in depth
```

This is one of the areas to practice heavily.

------------------------------------------------------------------------

# PHASE 8 --- AI / LLM Fundamentals

## 31. What Is an LLM?

Understand:

-   Large Language Model
-   Tokens
-   Context window
-   Prompt
-   System message
-   User message
-   Model output

------------------------------------------------------------------------

## 32. Tokens

Know why token limits matter.

A model does not simply count characters or words.

Understand:

``` text
Input tokens
+
Output tokens
=
Context / usage considerations
```

This becomes important when building RAG systems.

------------------------------------------------------------------------

## 33. Embeddings

An embedding converts text into a numerical vector representing semantic
meaning.

Concept:

``` text
"How do I reset my password?"
             ↓
        Embedding
             ↓
[0.12, -0.43, 0.88, ...]
```

Used for semantic search.

------------------------------------------------------------------------

## 34. Vector Search

Learn:

-   Vector
-   Similarity
-   Cosine similarity
-   Nearest-neighbor search
-   Vector database

------------------------------------------------------------------------

## 35. pgvector

Understand why PostgreSQL can also be used for vector search with the
`pgvector` extension.

Know the basic idea:

``` text
PostgreSQL
 ├── Normal relational data
 └── Vector embeddings
```

------------------------------------------------------------------------

# PHASE 9 --- RAG

## 36. What Is RAG?

RAG = Retrieval-Augmented Generation.

Instead of asking the LLM to answer only from its learned knowledge:

``` text
Question
   ↓
Retrieve relevant information
   ↓
Add information to prompt
   ↓
LLM
   ↓
Answer
```

------------------------------------------------------------------------

## 37. RAG Pipeline

Learn this end-to-end:

``` text
Documents
   ↓
Chunking
   ↓
Embeddings
   ↓
Vector Storage
   ↓
User Question
   ↓
Question Embedding
   ↓
Similarity Search
   ↓
Relevant Chunks
   ↓
Context Assembly
   ↓
LLM
   ↓
Answer
```

------------------------------------------------------------------------

## 38. Chunking

Understand:

-   Why documents are split
-   Chunk size
-   Chunk overlap
-   Metadata
-   Problems with chunks that are too large
-   Problems with chunks that are too small

------------------------------------------------------------------------

## 39. Retrieval

Learn:

-   Top-K retrieval
-   Similarity search
-   Metadata filtering
-   Hybrid search
-   Re-ranking

------------------------------------------------------------------------

## 40. Context Assembly Under a Token Limit

This is specifically worth practicing.

Problem:

> You have 20 retrieved documents but the model has a limited context
> window. Which information should be included?

Think about:

-   Relevance
-   Token budget
-   Recency
-   Source quality
-   Duplicates
-   Diversity
-   Priority

------------------------------------------------------------------------

# PHASE 10 --- AI Security

## 41. Prompt Injection

Understand:

> What happens if a user or document contains instructions designed to
> manipulate the AI?

Learn:

-   Direct prompt injection
-   Indirect prompt injection
-   Untrusted retrieved content
-   Tool/function abuse
-   Input/output validation

------------------------------------------------------------------------

## 42. Data Leakage

For a multi-tenant AI system:

``` text
Tenant A
   ↓
RAG retrieval
   ↓
ONLY Tenant A documents
```

Never allow Tenant A's retrieval process to return Tenant B's documents.

This connects **RLS + RAG + security**.

------------------------------------------------------------------------

## 43. Hallucinations

Understand:

-   What hallucination means
-   Why LLMs hallucinate
-   How RAG can reduce hallucinations
-   Why RAG does not guarantee correctness
-   Citations/source attribution
-   Evaluation

------------------------------------------------------------------------

# PHASE 11 --- Node.js + Python Backend Comparison

## 44. Async Programming

Compare:

``` text
Node.js
async/await
Promise
Event Loop

Python
async/await
asyncio
ASGI
Uvicorn
```

Understand that both can handle asynchronous I/O, but their runtimes and
concurrency models differ.

------------------------------------------------------------------------

## 45. FastAPI + Uvicorn + ASGI

Know these three terms:

``` text
FastAPI
   ↓
ASGI application
   ↓
Uvicorn
   ↓
Server
```

Understand what each component does.

------------------------------------------------------------------------

# PHASE 12 --- System Design

## 46. Design an AI Chatbot

Practice designing:

``` text
React
  ↓
API
  ↓
Authentication
  ↓
Chat Service
  ↓
RAG Service
  ↓
PostgreSQL + pgvector
  ↓
LLM Provider
```

Discuss:

-   Scalability
-   Caching
-   Rate limiting
-   Queues
-   Logging
-   Monitoring
-   Database scaling
-   Security
-   Cost

------------------------------------------------------------------------

## 47. Design a Multi-Tenant AI Platform

This should combine almost everything.

Requirements:

-   Multiple companies
-   Users
-   Documents
-   Chat
-   RAG
-   PostgreSQL
-   RLS
-   pgvector
-   Authentication
-   Tenant isolation

Be able to explain the architecture from request to response.

------------------------------------------------------------------------

# PHASE 13 --- Interview Exercises

## 48. RLS Exercise

Practice:

> Create a PostgreSQL design where each tenant can only read and modify
> its own rows.

Be ready to explain the policy and why application-level filtering alone
is insufficient.

------------------------------------------------------------------------

## 49. RAG Exercise

Practice:

> Given 10 retrieved chunks and a 4,000-token context budget, select and
> assemble the best context for the LLM.

Discuss:

-   Ranking
-   Token counting
-   Truncation
-   Deduplication
-   Relevance
-   Source priority

------------------------------------------------------------------------

## 50. AI-Generated Code Review

Practice reviewing code for:

-   Security bugs
-   SQL injection
-   Missing validation
-   Authentication problems
-   Authorization problems
-   Race conditions
-   Async mistakes
-   Connection leaks
-   Poor exception handling
-   N+1 queries
-   Inefficient database access
-   Prompt injection
-   Sensitive data exposure

The goal is not just:

> "This code doesn't work."

The goal is:

> "This works in the happy path, but fails under X condition and creates
> Y security/performance/reliability problem."

------------------------------------------------------------------------

# PHASE 14 --- Your Chatbot Project

## 51. Be Able to Explain Your Assessment

Prepare a 2--5 minute explanation:

``` text
1. What problem does it solve?
2. Architecture
3. Technology stack
4. API design
5. Database
6. AI/LLM integration
7. Authentication/security
8. Error handling
9. Challenges
10. What you would improve
```

------------------------------------------------------------------------

## 52. Questions They May Ask About Your Project

Prepare answers for:

-   Why did you choose Node.js?
-   Why this database?
-   How does the chatbot work internally?
-   How do you maintain conversation history?
-   How do you handle multiple users?
-   How would you scale it?
-   How would you reduce LLM cost?
-   How would you stream responses?
-   How would you handle LLM failures?
-   How would you prevent prompt injection?
-   How would you add RAG?
-   How would you deploy it?
-   What would you change if you rebuilt it?

------------------------------------------------------------------------

# PHASE 15 --- Product Thinking

## 53. Product Problem Solving

When they give you a product problem, use:

``` text
User
 ↓
Problem
 ↓
Requirements
 ↓
MVP
 ↓
Architecture
 ↓
Risks
 ↓
Metrics
```

Don't immediately jump into coding.

First understand:

-   Who is the user?
-   What problem are they solving?
-   What is the simplest useful solution?
-   What can go wrong?
-   How do we measure success?

------------------------------------------------------------------------

# PHASE 16 --- Team Fit / HR

## 54. Prepare Your Introduction

Have a concise answer for:

> Tell me about yourself.

Include:

-   Your experience
-   Full-stack background
-   Backend strengths
-   Relevant projects
-   AI/chatbot assessment
-   Why this role interests you

------------------------------------------------------------------------

## 55. Strengths / Weaknesses

Prepare genuine, professional answers.

Avoid generic answers like:

> "My weakness is that I'm a perfectionist."

Instead discuss a real professional limitation and how you are improving
it.

------------------------------------------------------------------------

## 56. Why Astroum AI?

Prepare an answer around:

-   AI product development
-   Full-stack engineering
-   Backend/API architecture
-   Opportunity to work with AI systems
-   Learning and ownership

------------------------------------------------------------------------

# FINAL 3-DAY REVISION CHECKLIST

## Day 1

### FastAPI

-   [ ] Python basics
-   [ ] FastAPI basics
-   [ ] Node vs FastAPI
-   [ ] Routes
-   [ ] HTTP methods
-   [ ] Path/query parameters
-   [ ] Request body
-   [ ] Pydantic
-   [ ] Response models
-   [ ] Dependency Injection
-   [ ] Middleware
-   [ ] Exception handling
-   [ ] CRUD
-   [ ] SQLAlchemy
-   [ ] Alembic

## Day 2

### PostgreSQL + Security

-   [ ] SQL
-   [ ] Joins
-   [ ] Indexes
-   [ ] Transactions
-   [ ] ACID
-   [ ] Query optimization
-   [ ] Connection pooling
-   [ ] PostgreSQL architecture
-   [ ] Multi-tenancy
-   [ ] RLS
-   [ ] RLS policies
-   [ ] Tenant isolation

### AI

-   [ ] LLM
-   [ ] Tokens
-   [ ] Embeddings
-   [ ] Vector search
-   [ ] pgvector
-   [ ] RAG
-   [ ] Chunking
-   [ ] Retrieval
-   [ ] Context assembly

## Day 3

### Interview Practice

-   [ ] RLS exercise
-   [ ] RAG exercise
-   [ ] AI code review
-   [ ] System design
-   [ ] Chatbot project demo
-   [ ] Project questions
-   [ ] Product thinking
-   [ ] Team-fit questions
-   [ ] Mock interview

------------------------------------------------------------------------

# IMPORTANT STUDY RULE

Do **not** try to finish this entire document by memorizing definitions.

For every topic:

``` text
1. Learn what it is
2. Understand why it exists
3. See a small example
4. Build/use it
5. Compare it with Node.js/Laravel
6. Answer one interview question
```

For example:

``` text
RLS
 ↓
What is it?
 ↓
Why do we need it?
 ↓
Small PostgreSQL example
 ↓
Tenant-isolation exercise
 ↓
Explain it in an interview
```

This will prepare you much better than simply reading theory.

------------------------------------------------------------------------

# START HERE

Begin with:

**1. Python Basics Required for FastAPI**

Then proceed strictly in order.

When you finish each topic, move to the next one. For the important
topics---especially **FastAPI CRUD, PostgreSQL, RLS, RAG, and the
interview exercises**---practice with actual code rather than only
definitions.
