var clientRedis = require('../database/redis_connection')

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

function getLastKnownID(isPlayer = false, isGame = false, isBoard = false) {
    console.log(`player: ${isPlayer}, game: ${isGame}, board: ${isBoard}`);
    if (isPlayer) {
        return new Promise(resolve => {
            clientRedis.get('playerID', (err, result) => {
                console.log(`getLastKnownID ${result}`)
                if (result) {
                    resolve(parseInt(result));
                } else {
                    resolve(0);
                }
            });
        });
    }

    if (isGame) {
        return new Promise(resolve => {
            clientRedis.get('gameID', (err, result) => {
                console.log(`getLastKnownID ${result}`)
                if (result) {
                    resolve(parseInt(result));
                } else {
                    resolve(0);
                }
            });
        });
    }

    if (isBoard) {
        return new Promise(resolve => {
            clientRedis.get('boardID', (err, result) => {
                console.log(`getLastKnownID ${result}`)
                if (result) {
                    resolve(parseInt(result));
                } else {
                    resolve(0);
                }
            });
        });
    }
}

function saveID(id, isPlayer = false, isGame = false, isBoard = false) {
    console.log(`player: ${isPlayer}, game: ${isGame}, board: ${isBoard}`)
    if (isPlayer) {
        return new Promise(resolve => {
            clientRedis.set('playerID', id, (err, result) => {
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

    if (isGame) {
        return new Promise(resolve => {
            clientRedis.set('gameID', id, (err, result) => {
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

    if (isBoard) {
        return new Promise(resolve => {
            clientRedis.set('boardID', id, (err, result) => {
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

function update(key, data, isPlayer = false, isGame = false, isBoard = false) {
    console.log(`client: ${isPlayer}, game: ${isGame}, board: ${isBoard}`)
    if (isPlayer) {
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

    if (isGame) {
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

    if (isBoard) {
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
    deleteAll
}