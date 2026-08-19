// config/redis.js
const redis = require('redis');
const client = redis.createClient();
client.connect().catch(err => console.log('Redis not available:', err.message));

module.exports = client;
