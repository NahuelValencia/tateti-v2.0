var express = require('express');
var tatetiRouter = express.Router();
var HttpStatus = require('http-status-codes');

//var errorResponse = require('../utils/utils').errorResponse;

var RedisClient = require('../database/redis_adapter')

//GETS
tatetiRouter.get('/', async function(req, res, next) {

    var patternkey = `client#*`;
    var clients = new Array();

    try {
        var allClients = await RedisClient.getAll(patternkey);
    } catch (err) {
        return console.log(`An error has occurred: ${err}`)
    }

    if (allClients.length > 0) {
        console.log(`All clients: ${allClients}`)

        for (idClient of allClients) {
            console.log(idClient)

            try {
                var client = await RedisClient.searchById(idClient)
            } catch (err) {
                return console.log(`An error has occurred: ${err}`)
            }

            clients.push(client)

        }

        res.json({
            status: HttpStatus.OK,
            response: clients
        });

    } else {
        res.json({
            status: HttpStatus.NOT_FOUND,
            response: errorResponse
        });
    }
});
tatetiRouter.get('/:clientId', async function(req, res, next) {
    var key = `client#${req.params.clientId}`

    try {
        var response = await RedisClient.searchById(key)
        console.log(response)
    } catch (err) {
        return console.log(`An error has occurred: ${err}`)
    }

    if (response) {
        res.json({
            status: HttpStatus.OK,
            response: response
        });
    } else {
        return res.json({
            status: HttpStatus.NOT_FOUND,
            response: errorResponse
        });
    }

});

//POSTS
tatetiRouter.post('/', async function(req, res, next) {
    try {
        var id = await RedisClient.getLastKnownID(isClient = true, isContract = false, isBoard = false);
        var newClientId = id + 1;
        console.log(`New client ID: ${newClientId}`)
    } catch (err) {
        return console.log(`An error has occurred: ${err}`)
    }

    try {
        await RedisClient.saveID(newClientId, isClient = true);
    } catch (err) {
        return console.log(`An error has occurred: ${err}`)
    }

    var data = req.body
    data.clientId = newClientId
    var key = `client#${newClientId}`

    try {
        var response = await RedisClient.save(key, data)
        console.log(response)

    } catch (err) {
        return console.log(`An error has occurred: ${err}`)
    }

    if (response) {
        res.json({
            status: HttpStatus.OK,
            response: data
        });
    } else {
        res.json({
            status: HttpStatus.BAD_REQUEST,
            response: "Can't create new client" + error
        });
    }
});

//DELETES
tatetiRouter.delete('/', async function(req, res, next) {
    var response = await RedisClient.deleteAll()

    if (response) {
        res.json({
            status: HttpStatus.OK,
            response: 'All clients and contracts have been deleted'
        });
    } else {
        res.json({
            status: HttpStatus.NOT_FOUND,
            response: errorResponse
        });
    }

});
tatetiRouter.delete('/:clientId', async function(req, res, next) {
    var key = `client#${req.params.clientId}`

    var response = await RedisClient.deleteByID(key)

    if (response) {
        res.json({
            status: HttpStatus.OK,
            response: `Client ${req.params.clientId} deleted`
        });
    } else {
        res.json({
            status: HttpStatus.NOT_FOUND,
            response: errorResponse
        });
    }
});

/* DELETE ALL CONTRACTS ?????
tatetiRouter.delete('/contracts', function(req, res, next) {
    res.send('DELETE all contracts');
});
*/

//PUTS
tatetiRouter.put('/:clientId', async function(req, res, next) {
    var data = req.body
    data.clientId = req.params.clientId

    var key = `client#${data.clientId}`

    //check if the client existe
    try {
        var exists = await RedisClient.resourceExists(key)
    } catch (err) {
        return console.log(`An error has occurred aqui: ${err}`)
    }

    if (exists == 1) {
        try {
            var response = await RedisClient.update(key, data, isClient = true, isContract = false)

            if (response) {
                res.json({
                    status: HttpStatus.OK,
                    response: data
                });
            } else {
                res.json({
                    status: HttpStatus.BAD_REQUEST,
                    response: "Can't update client" + err
                });
            }

        } catch (err) {
            return console.log(`An error has occurred o aqui: ${err}`)
        }

    } else {
        res.json({
            status: HttpStatus.NOT_FOUND,
            response: errorResponse
        });
    }
});

module.exports = tatetiRouter;