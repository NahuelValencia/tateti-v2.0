var express = require('express');
var gameRouter = express.Router();
var HttpStatus = require('http-status-codes');

var message = require('../utils/responseConstants');
var token = require('../utils/tokenGenerator');
const Cryptr = require('cryptr');

var parse = require('body-parser')

var RedisClient = require('../database/redis_adapter')


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


    //SEARCH PLAYERS SENT IN BODY, IN REDIS BY ID
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

    //CREATE A GAME
    try {
        var id = await RedisClient.getLastKnownID(isPlayer = false, isGame = true, isBoard = false, isRoom = false);
        console.log(`Game previous id: ${id}`)
        var newGameId = id + 1;
    } catch (err) {
        return console.log(`An error has occurred: ${err}`)
    }

    try {
        await RedisClient.saveID(newGameId, isPlayer = false, isGame = true, isBoard = false, isRoom = false);
    } catch (err) {
        return console.log(`An error has occurred: ${err}`)
    }

    //SEARCH THE ROOM
    var room_key = `waitingRoom#${req.body.roomId}`
    try {
        var room = await RedisClient.searchById(room_key)
    } catch (error) {
        return console.log(`An error has occurred: ${error}`)
    }
    //UPDATE ROOM
    room.gameReady = true
    room['gameId'] = newGameId
    try {
        await RedisClient.update(room_key, room, isPlayer = false, isGame = false, isBoard = false, isRoom = true)
    } catch (error) {
        return console.log(`An error has occurred: ${error}`)
    }

    //SAVE THE GAME IN REDIS. Also relate the player with the game
    var game_data = {}
    game_data.gameId = newGameId;
    game_data.status = "Started";
    game_data.winner = "null";
    game_data.moveQty = 0;
    game_data.player1 = players[0].playerId;
    game_data.player2 = players[1].playerId;


    //CREAT A BOARD
    try {
        var id = await RedisClient.getLastKnownID(isPlayer = false, isGame = false, isBoard = true, isRoom = false);
        console.log(`Board previous id: ${id}`)
        var newBoardId = id + 1;
    } catch (err) {
        return console.log(`An error has occurred: ${err}`)
    }
    //set the boardId to the game
    game_data.boardId = newBoardId;

    try {
        await RedisClient.saveID(newBoardId, isPlayer = false, isGame = false, isBoard = true, isRoom = false);
    } catch (err) {
        return console.log(`An error has occurred: ${err}`)
    }


    /*
    en redis no se puede guardar mas que string.
    por lo que el tratamos estructuras complejas por separado y 
    la estructura que vamos a mandar al JSON le ponemos todo
    */

    var game_key = `game#${newGameId}`;

    try {
        await RedisClient.save(game_key, game_data)
    } catch (err) {
        return console.log(`An error has occurred: ${err}`)
    }

    //SAVE THE BOARD
    var board = {
        0: "",
        1: "",
        2: "",
        3: "",
        4: "",
        5: "",
        6: "",
        7: "",
        8: "",
    }

    var board_key = `board#${newBoardId}`;

    try {
        var response = await RedisClient.save(board_key, board)
    } catch (err) {
        return console.log(`An error has occurred: ${err}`)
    }

    //Lo seteo aca para mostrarlo en el JSON. No se puede guardar en redis todo junto
    var data = {};
    data.gameId = game_data.gameId;
    data.status = game_data.status;
    data.winner = game_data.winner;
    data.moveQty = game_data.moveQty;
    data.players = players;
    data.boardId = game_data.boardId;
    data.board = board;

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


//GET
gameRouter.get('/:gameId', async function(req, res, next) {

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

    //SEARCH GAME
    var game_key = `game#${req.params.gameId}`
    try {
        var game = await RedisClient.searchById(game_key)
    } catch (error) {
        return console.log(`An error has occurred: ${error}`)
    }

    if (game) {
        console.log(game)
        try {
            var player1 = await RedisClient.searchById(`player#${game.player1}`)
            var player2 = await RedisClient.searchById(`player#${game.player2}`)
            var board = await RedisClient.searchById(`board#${game.boardId}`)
        } catch (error) {
            return console.log(`An error has occurred: ${error}`)
        }
    } else {
        return res.json({
            status: HttpStatus.NOT_FOUND,
            response: message.notFound
        });
    }

    //Lo seteo aca para mostrarlo en el JSON. No se puede guardar en redis todo junto
    var data = {};
    data.gameId = game.gameId;
    data.status = game.status;
    data.winner = game.winner;
    data.moveQty = game.moveQty;
    data.players = new Array();
    data.players[0] = player1;
    data.players[1] = player2;
    data.boardId = game.boardId;
    data.board = board;

    console.log(data)

    if (board && player1 && player2) {
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