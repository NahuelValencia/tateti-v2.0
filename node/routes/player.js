var express = require('express');
var playerRouter = express.Router();
var HttpStatus = require('http-status-codes');

var message = require('../utils/responseConstants');
const Cryptr = require('cryptr');

var RedisClient = require('../database/redis_adapter');

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

    if (req.body.name == "" || req.body.name == null) {
        return res.json({
            status: HttpStatus.BAD_REQUEST,
            response: message.noName
        });
    }

    //CREATE PLAYER
    try {
        var id = await RedisClient.getLastKnownID(isPlayer = true, isGame = false, isBoard = false, isRoom = false);
        var newPlayerId = id + 1;
    } catch (err) {
        return console.log(`An error has occurred: ${err}`)
    }

    try {
        await RedisClient.saveID(newPlayerId, isPlayer = true, isGame = false, isBoard = false, isRoom = false);
    } catch (err) {
        return console.log(`An error has occurred: ${err}`)
    }

    var player_data = req.body;

    player_data.turn = false;
    player_data.playerId = newPlayerId;
    player_data.session_token = private_token;

    var player_key = `player#${newPlayerId}`;

    try {
        var player_saved = await RedisClient.save(player_key, player_data);
    } catch (err) {
        return console.log(`An error has occurred: ${err}`)
    }

    //Json with player
    if (player_saved) {
        res.json({
            status: HttpStatus.OK,
            response: player_data
        });
    } else {
        res.json({
            status: HttpStatus.BAD_REQUEST,
            response: message.cantCreate + error
        });
    }
});

//GET just to check if the player has been created
//POSTS
playerRouter.get('/', async function(req, res, next) {
    try {
        var allPlayers = await RedisClient.getAll(`player#*`)
    } catch (err) {
        return console.log(`An error has occurred: ${err}`)
    }

    var players = new Array()
    for (const playerId of allPlayers) {
        try {
            var player = await RedisClient.searchById(playerId)
        } catch (error) {
            return console.log(`An error has occurred: ${error}`)
        }
        players.push(player)
    }
    //Json with players
    if (players.length > 0) {
        res.json({
            status: HttpStatus.OK,
            response: players
        });
    } else {
        res.json({
            status: HttpStatus.NOT_FOUND,
            response: message.notFound + error
        });
    }
});


module.exports = playerRouter;