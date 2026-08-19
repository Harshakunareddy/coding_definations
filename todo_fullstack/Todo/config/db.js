const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("todo_db", "root", "", {
  host: "127.0.0.1",
  dialect: "mysql",
  pool: {max:20, min:5, idle:10000 }
});
// mysql2
module.exports = sequelize;


// host: "localhost", pg pg-hstore
// port: 5432,
// dialect: "postgres",

// const connectDB = async () => {
//   try {
//     await mongoose.connect("mongodb://127.0.0.1:27017/todo_db");
// }
// module.exports = connectDB and import it on the server.js and connectDB line




// ============ 6. Horizontal Scaling Concepts ============
//
// Load Balancer:
//   - Nginx/AWS ALB distributes traffic across multiple Node instances
//   - If one server dies, traffic goes to the others
//   - Client → Load Balancer → Server 1 / Server 2 / Server 3
//
// PM2 Cluster Mode:
//   - pm2 start server.js -i max → runs one process per CPU core
//   - Node.js is single-threaded, so without this you only use 1 core
//   - 4-core machine = 4 processes = 4x throughput
//
// Stateless Server:
//   - No user data stored in memory (no sessions, no local state)
//   - Every request is independent, any server can handle any request
//   - This app is already stateless — data lives in the DB, not memory
//   - Stateless = easy to scale horizontally (just add more servers)
//
// Read Replicas:
//   - Master DB handles writes (INSERT/UPDATE/DELETE)
//   - Replica DBs handle reads (SELECT) — most apps read 90%, write 10%
//   - Master syncs data to replicas automatically
//
// Database Sharding:
//   - Split data across multiple DBs by a rule (e.g., user ID range)
//   - User 1-1M → DB1, User 1M-2M → DB2, User 2M-3M → DB3
//   - Each DB holds less data = faster queries
//   - Complex to implement, used at very large scale (millions of users)
//
// Message Queues (RabbitMQ / Bull):
//   - Heavy tasks (emails, reports, image processing) should NOT block the request
//   - Without queue: Client → POST /report → 30s processing → response (blocks)
//   - With queue: Client → POST /report → push to queue → instant response
//     Worker picks up the task in the background
//
// Vertical vs Horizontal Scaling:
//   - Vertical: bigger machine (more RAM/CPU) — has a hardware limit
//   - Horizontal: more machines — practically unlimited, but app must be stateless

// ============ Interview Q&A ============
//
// Q: "How would you handle 10K requests/sec?"
// A: Load balancer + PM2 cluster + Redis cache + DB read replicas + pagination
//    (layer by layer — spread traffic, use all cores, cache reads, scale DB, limit data)
//
// Q: "Your DB is slow, what do you do?"
// A: Follow this order (cheapest fix first):
//    1. Indexing → add indexes on columns used in WHERE/ORDER BY
//    2. Query optimization → avoid SELECT *, avoid N+1, use specific columns
//    3. Read Replicas → offload reads to replica DBs
//    4. Caching → Redis for frequently accessed data
//    5. Sharding → last resort, split data across multiple DBs
//
// Q: "What's the difference between vertical and horizontal scaling?"
// A: Vertical = bigger machine (more RAM/CPU), has a hardware ceiling
//    Horizontal = more machines, practically unlimited, but app must be stateless
//    Horizontal is preferred because it has no ceiling
//
// Q: "How do you handle long-running tasks?"
// A: Never block the request. Use a message queue (Bull/RabbitMQ)
//    Push task to queue → respond immediately with 202 Accepted
//    Worker picks up the task and processes it in the background
//
// Q: "What is N+1 query problem?"
// A: Fetching related data in a loop = 1 query + N extra queries
//    Example: 100 tasks → 1 findAll + 100 findByPk for each user = 101 queries
//    Fix: eager loading → Task.findAll({ include: [{ model: User }] }) = 1 query with JOIN
