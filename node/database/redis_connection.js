var redis = require('redis');
require('dotenv').config();

var port = process.env.REDIS_PORT;
var host = process.env.REDIS_HOST;

var clientRedis = redis.createClient()

clientRedis.on('connect', function() {
    console.log(`Redis client connected to ${host}:${port}`);
});
clientRedis.on('error', function(err) {
    console.log(`Redis client cannot connect to ${host}:${port}`);
    console.log('Error: ' + err);
});

module.exports = clientRedis;