var clientRedis = require('../database/redis_connection')

const Enum = require('enum')

const redisKeyEnum = new Enum({
    PLAYER: "player#",
    ROOM: "waitingRoom#",
    GAME: "game#",
    BOARD: "board#",
    PLAYERID: "playerID",
    GAMEID: "gameID",
    BOARDID: "boardID",
    ROOMID: "roomID"
})

function getAll(patternKey) {
    return new Promise(resolve => {
        clientRedis.keys(patternKey, (error, result) => {
            if (result) {
                resolve(result);
            } else {
                resolve(error);
            }
        });
    });
}

function searchById(key) {
    return new Promise(resolve => {
        clientRedis.hgetall(key, (error, result) => {
            console.log(`KEY: ${key}`);
            if (result) {
                console.log(`Result: ${result}`)
                resolve(result)
            } else {
                console.log(`Error: ${error}`)
                resolve(error)
            }
        });
    });
}

function getLastKnownID(key) {
    return new Promise(resolve => {
        clientRedis.get(key, (err, result) => {
            console.log(`getLastKnownID ${result}`)
            if (result) {
                resolve(parseInt(result));
            } else {
                resolve(0);
            }
        });
    });
}

function saveID(id, key) {
    return new Promise(resolve => {
        clientRedis.set(key, id, (err, result) => {
            if (result) {
                console.log(result);
                resolve(null);
            } else {
                console.log(err);
                resolve(err);
            }
        });
    });
}

function save(key, data) {
    return new Promise(resolve => {
        clientRedis.hmset(key, data, (error, result) => {
            if (result) {
                console.log(`Result: ${result}`)
                resolve(result)
            } else {
                console.log(`Error: ${error}`)
                resolve(error)
            }
        });
    });
}

function resourceExists(key) {
    return new Promise(resolve => {
        clientRedis.exists(key, (error, ok) => {
            if (ok) {
                console.log(`Exists? ${ok}`)
                resolve(ok)
            } else {
                console.log(`Error: ${error}`)
                resolve(error)
            }
        });
    });
}

function update(key, data) {
    return new Promise(resolve => {
        clientRedis.hmset(key, data, (error, result) => {
            if (result) {
                console.log(`Result: ${result}`)
                resolve(result)
            } else {
                console.log(`Error: ${error}`)
                resolve(error)
            }
        });
    });
}

function deleteByID(key) {
    return new Promise(resolve => {
        clientRedis.del(key, (error, result) => {
            if (result) {
                resolve(result)
            } else {
                resolve(error)
            }
        });
    });
}

function deleteAll() {
    return new Promise(resolve => {
        clientRedis.flushall((error, result) => {
            if (result) {
                resolve(result)
            } else {
                resolve(error)
            }
        });
    });
}

module.exports = {
    getAll,
    searchById,
    save,
    getLastKnownID,
    saveID,
    resourceExists,
    update,
    deleteByID,
    deleteAll,
    redisKeyEnum
}