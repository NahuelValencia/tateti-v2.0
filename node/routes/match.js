var express = require('express');
var moveRouter = express.Router();
var HttpStatus = require('http-status-codes');

var message = require('../utils/responseConstants');
var tateti = require('../utils/tatetiUtils');
var token = require('../utils/tokenGenerator');
const Cryptr = require('cryptr');

var parse = require('body-parser')

var RedisClient = require('../database/redis_adapter')


//PUT
moveRouter.put('/', async function(req, res, next) {
    console.log(req.body)

    const header_token = req.header('Authorization'); //ProgAv2020
    console.log(header_token)

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


    //SEARCH GAME
    var game_key = `game#${req.body.gameId}`;
    console.log(`gameId: ${game_key}`);

    try {
        var game = await RedisClient.searchById(game_key);
        console.log(game)
    } catch (e) {
        return console.log(`An error has occurred: ${e}`);
    }

    //check game status
    if (game.status == "Game Over") {
        return res.json({
            status: HttpStatus.BAD_REQUEST,
            response: message.gameEnded
        });
    }

    game.moveQty = parseInt(game.moveQty) + 1;


    //SEARCH THE PLAYER IN REDIS
    var player_key = `player#${req.body.playerId}`;
    console.log(`playerId: ${player_key}`);

    try {
        var player = await RedisClient.searchById(player_key);
        console.log(player);
    } catch (e) {
        return console.log(`An error has occurred: ${e}`);
    }

    //SEARCH THE BOARD IN REDIS
    var board_key = `board#${req.body.boardId}`;
    console.log(`boardId: ${board_key}`);
    //search board
    try {
        var board = await RedisClient.searchById(board_key);
        console.log(board)
    } catch (e) {
        return console.log(`An error has occurred: ${e}`);
    }

    var position = `${req.body.position}`;
    console.log(position)

    //set the player to the board
    var move = {};
    move.playerId = player.playerId;
    move.gameId = game.gameId;
    move.boardId = req.body.boardId;
    move.position = position;

    console.log("move...") //check if move is necesary
    console.log(move)

    currentPlayer = player;
    //change board value
    board[position] = currentPlayer.playerId
    console.log("Board updated")
    console.log(board)

    //change game status
    game.status = "In Progress"

    console.log("game...")
    console.log(game)


    //check if there is a winner
    if (tateti.isTateti(game, board, currentPlayer)) {
        console.log("isTateti")
        game.winner = currentPlayer.playerId;
        game.status = "Game Over"
    }

    //UPDATE THE GAME
    try {
        await RedisClient.update(game_key, game, isPlayer = false, isGame = true, isBoard = false)
    } catch (err) {
        return console.log(`An error has occurred o aqui: ${err}`)
    }

    //UPDATE THE BOARD
    try {
        var response = await RedisClient.update(board_key, board, isPlayer = false, isGame = false, isBoard = true)
    } catch (err) {
        return console.log(`An error has occurred o aqui: ${err}`)
    }

    var data = {}
    data.gameId = game.gameId;
    data.status = game.status;
    data.winner = game.winner;
    data.moveQty = game.moveQty;
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