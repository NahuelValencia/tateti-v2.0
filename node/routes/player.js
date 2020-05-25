var express = require('express');
var playerRouter = express.Router();
var HttpStatus = require('http-status-codes');

var message = require('../utils/responseConstants');
var piece = require('../utils/pieceUtils');
var token = require('../utils/tokenGenerator');
const Cryptr = require('cryptr');

var parse = require('body-parser')

var RedisClient = require('../database/redis_adapter')

//GETS
/*playerRouter.get('/', async function(req, res, next) {

    var patternkey = `player#*`;
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
playerRouter.get('/:playerId', async function(req, res, next) {
    var key = `player#${req.params.playerId}`

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

});*/

//POSTS
playerRouter.post('/', async function(req, res, next) {
    //TODO mover esto a un lugar comun
    const authorization = req.header('Authorization'); //ProgAv2020

    if (authorization != process.env.SECRET_KEY) {
        return res.json({
            status: HttpStatus.UNAUTHORIZED,
            response: message.notAuthorized
        });
    }
    const encrypt = new Cryptr(authorization);
    const private_token = encrypt.encrypt(authorization);
    //    const decryptedString = encrypt.decrypt(private_token); para verificar si el user es valido
    //    console.log(decryptedString)

    try {
        var id = await RedisClient.getLastKnownID(isPlayer = true, isGame = false, isBoard = false);
        var newPlayerId = id + 1;
    } catch (err) {
        return console.log(`An error has occurred: ${err}`)
    }

    try {
        await RedisClient.saveID(newPlayerId, isPlayer = true);
    } catch (err) {
        return console.log(`An error has occurred: ${err}`)
    }

    //TODO: check piece selected (X or O)

    var data = req.body;
    data.playerId = newPlayerId;
    data.session_token = private_token
    var key = `player#${newPlayerId}`;

    try {
        var response = await RedisClient.save(key, data)
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
            response: message.cantCreate + error
        });
    }
});

//DELETES
/*playerRouter.delete('/', async function(req, res, next) {
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
playerRouter.delete('/:playerId', async function(req, res, next) {
    var key = `player#${req.params.playerId}`

    var response = await RedisClient.deleteByID(key)

    if (response) {
        res.json({
            status: HttpStatus.OK,
            response: `Client ${req.params.playerId} deleted`
        });
    } else {
        res.json({
            status: HttpStatus.NOT_FOUND,
            response: errorResponse
        });
    }
});

/* DELETE ALL CONTRACTS ?????
playerRouter.delete('/contracts', function(req, res, next) {
    res.send('DELETE all contracts');
});
*/

//PUTS
/*playerRouter.put('/:playerId', async function(req, res, next) {
    var data = req.body
    data.playerId = req.params.playerId

    var key = `player#${data.playerId}`

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
*/

module.exports = playerRouter;