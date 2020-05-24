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
            console.log(`KEY: ${key}`)
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

function getLastKnownID(isClient = false, isContract = false) {
    console.log(`client: ${isClient}, contract: ${isContract}`)
    if (isClient) {
        return new Promise(resolve => {
            clientRedis.get('clientID', (err, result) => {
                console.log(`getLastKnownID ${result}`)
                if (result) {
                    resolve(parseInt(result));
                } else {
                    resolve(0);
                }
            });
        });
    }

    if (isContract) {
        return new Promise(resolve => {
            clientRedis.get('contractID', (err, result) => {
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

function saveID(id, isClient = false, isContract = false) {
    console.log(`client: ${isClient}, contract: ${isContract}`)
    if (isClient) {
        return new Promise(resolve => {
            clientRedis.set('clientID', id, (err, result) => {
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

    if (isContract) {
        return new Promise(resolve => {
            clientRedis.set('contractID', id, (err, result) => {
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

function update(key, data, isClient = false, isContract = false) {
    console.log(`client: ${isClient}, contract: ${isContract}`)
    if (isClient) {
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

    if (isContract) {
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