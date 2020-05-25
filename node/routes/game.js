var express = require('express');
var gameRouter = express.Router();
var HttpStatus = require('http-status-codes');

var message = require('../utils/responseConstants');
var token = require('../utils/tokenGenerator');
const Cryptr = require('cryptr');

var parse = require('body-parser')

var RedisClient = require('../database/redis_adapter')

//GETS
/*gameRouter.get('/', async function(req, res, next) {

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
gameRouter.get('/:playerId', async function(req, res, next) {
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
gameRouter.post('/', async function(req, res, next) {
    console.log(req.body)

    const header_token = req.header('Authorization'); //ProgAv2020
    console.log(header_token)

    const cryptr = new Cryptr(process.env.SECRET_KEY);

    try {
        var authorization = cryptr.decrypt(header_token);
        console.log(authorization)
    } catch (e) {
        return res.json({
            status: HttpStatus.UNAUTHORIZED,
            response: message.notAuthorized
        });
    }

    if (authorization != process.env.SECRET_KEY) {
        return res.json({
            status: HttpStatus.UNAUTHORIZED,
            response: message.notAuthorized
        });
    }

    //search players in redis by Id
    var players = new Array();
    try {
        for (player of req.body.players) {
            console.log(player.id)
            var key = `player#${player.id}`
            players.push(await RedisClient.searchById(key))
        }
        console.log(players)
    } catch (error) {
        return console.log(`An error has occurred: ${error}`)
    }

    //set game id
    try {
        var id = await RedisClient.getLastKnownID(isPlayer = false, isGame = true);
        console.log(`Game previous id: ${id}`)
        var newGameId = id + 1;
    } catch (err) {
        return console.log(`An error has occurred: ${err}`)
    }

    try {
        await RedisClient.saveID(newGameId, isPlayer = false, isGame = true);
    } catch (err) {
        return console.log(`An error has occurred: ${err}`)
    }

    //save the game
    var data = {}
    data.gameId = newGameId;
    data.status = "Started";
    data.winner = "null";
    data.moveQty = 0;

    //en redis no se puede guardar mas que string. por lo que el tratamos estructuras complejas por separado y la estructura que vamos a mandar al JSON le ponermo todo

    var game_key = `game#${newGameId}`;

    try {
        await RedisClient.save(game_key, data)
    } catch (err) {
        return console.log(`An error has occurred: ${err}`)
    }


    //set board id
    try {
        var id = await RedisClient.getLastKnownID(isPlayer = false, isGame = false, isBoard = true);
        console.log(`Board previous id: ${id}`)
        var newBoardId = id + 1;
    } catch (err) {
        return console.log(`An error has occurred: ${err}`)
    }

    try {
        await RedisClient.saveID(newBoardId, isPlayer = false, isGame = false, isBoard = true);
    } catch (err) {
        return console.log(`An error has occurred: ${err}`)
    }

    //create the board
    var board = {
        "0": "null",
        "1": "null",
        "2": "null",
        "3": "null",
        "4": "null",
        "5": "null",
        "6": "null",
        "7": "null",
        "8": "null",
    }

    var board_key = `board#${newBoardId}`;

    try {
        var response = await RedisClient.save(board_key, board)
    } catch (err) {
        return console.log(`An error has occurred: ${err}`)
    }

    //lo seteo aca para mostrarlo en el JSON. No se puede guardar en redis todo junto
    data.players = players
    data.boardId = newBoardId
    data.board = board

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


//DELETE
gameRouter.delete('/', async function(req, res, next) {
    var response = await RedisClient.deleteAll()

    if (response) {
        res.json({
            status: HttpStatus.OK,
            response: 'All games and players have been deleted'
        });
    } else {
        res.json({
            status: HttpStatus.NOT_FOUND,
            response: errorResponse
        });
    }

});

module.exports = gameRouter;