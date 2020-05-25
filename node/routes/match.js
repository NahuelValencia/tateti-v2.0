var express = require('express');
var moveRouter = express.Router();
var HttpStatus = require('http-status-codes');

var message = require('../utils/responseConstants');
var token = require('../utils/tokenGenerator');
const Cryptr = require('cryptr');

var parse = require('body-parser')

var RedisClient = require('../database/redis_adapter')

//GETS
/*moveRouter.get('/', async function(req, res, next) {

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
moveRouter.get('/:playerId', async function(req, res, next) {
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

//PUT
moveRouter.put('/', async function(req, res, next) {
    console.log(req.body)

    const header_token = req.header('Authorization'); //ProgAv2020
    console.log(header_token)

    /*
    deberia enviar el token que se le genero al usuario cdo se registro
    Debe ir en el header cdo le da a play
    Despues de verificar si se envia un header, se deberia desencriptar y el valor tiene que ser igual
    a ProgAv2020
    */

    const cryptr = new Cryptr(process.env.SECRET_KEY);
    //const private_token = encrypt.encrypt(authorization);
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

    var player_key = `player#${req.body.playerId}`;
    console.log(`playerId: ${player_key}`);
    //search player
    try {
        var player = await RedisClient.searchById(player_key);
        console.log(player);
    } catch (e) {
        return console.log(`An error has occurred: ${e}`);
    }

    var game_key = `game#${req.body.gameId}`;
    console.log(`gameId: ${game_key}`);
    //search game
    try {
        var game = await RedisClient.searchById(game_key);
        console.log(game)
    } catch (e) {
        return console.log(`An error has occurred: ${e}`);
    }


    var board_key = `board#${req.body.boardId}`;
    console.log(`boardId: ${board_key}`);
    //search board
    try {
        var board = await RedisClient.searchById(board_key);
        console.log(board)
    } catch (e) {
        return console.log(`An error has occurred: ${e}`);
    }


    var position = `c${req.body.position}`;
    console.log(position)

    //set piece to the board
    var move = {};
    move.playerId = player.playerId;
    move.gameId = game.gameId;
    move.boardId = req.body.boardId;
    move.position = position;

    console.log("move...")
    console.log(move)


    //change board value
    board[position] = move.playerId
    console.log("New board")
    console.log(board)

    //change game status
    game.status = "In progress"

    console.log("game...")
    console.log(game)

    //update game
    try {
        var response = await RedisClient.update(game_key, game, isPlayer = false, isGame = true, isBoard = false)
    } catch (err) {
        return console.log(`An error has occurred o aqui: ${err}`)
    }

    //update board
    try {
        var response = await RedisClient.update(board_key, board, isPlayer = false, isGame = false, isBoard = true)
    } catch (err) {
        return console.log(`An error has occurred o aqui: ${err}`)
    }

    var data = {}
    data.gameId = game.gameId;
    data.status = game.status;
    data.winner = game.winner;
    data.players = "players";
    data.boardId = req.body.boardId;
    data.board = board;

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
});

module.exports = moveRouter;