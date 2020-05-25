var express = require('express');
var playerRouter = express.Router();
var HttpStatus = require('http-status-codes');

var message = require('../utils/responseConstants');
var piece = require('../utils/pieceUtils');
var token = require('../utils/tokenGenerator');
const Cryptr = require('cryptr');

var parse = require('body-parser');

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

    //Set turn accorddind to the piece selected (X or O). Xs starts.
    if (player_data.pieceSelected == 'X') {
        player_data.turn = true;
    }

    //TODO: Verificar que el otro jugador que se quiere unir al juego no haya seleccionado la misma ficha.

    player_data.playerId = newPlayerId;
    player_data.session_token = private_token

    var player_key = `player#${newPlayerId}`;


    /*
    CREATE WAITING ROOM
    check waiting room. If there is a room with just one player we can play.
    If there is room available, create it!
    */

    var roomData = {};

    try {
        var allRooms = await RedisClient.getAll("waitingRoom#*");
    } catch (err) {
        return console.log(`An error has occurred: ${err}`)
    }

    if (allRooms.length > 0) {
        let availableRooms = new Array();

        for (roomId of allRooms) {
            console.log(roomId)

            try {
                var room = await RedisClient.searchById(roomId)
            } catch (err) {
                return console.log(`An error has occurred: ${err}`)
            }

            //verificar si estan disponibles
            if (room.available == "true") {
                availableRooms.push(room);
            }
        }

        if (availableRooms.length > 0) {
            roomData = availableRooms[0]
            roomData.player2 = parseInt(newPlayerId);
            roomData.available = false;

            try {
                await RedisClient.update(`waitingRoom#${roomData.roomId}`, roomData, isPlayer = false, isGame = false, isBoard = false, isRoom = true);
            } catch (err) {
                return console.log(`An error has occurred: ${err}`)
            }
        } else {

            try {
                var id = await RedisClient.getLastKnownID(isPlayer = false, isGame = false, isBoard = false, isRoom = true);
                var newRoomId = id + 1;
            } catch (err) {
                return console.log(`An error has occurred: ${err}`)
            }

            try {
                await RedisClient.saveID(newRoomId, isPlayer = false, isGame = false, isBoard = false, isRoom = true);
            } catch (err) {
                return console.log(`An error has occurred: ${err}`)
            }

            var room_key = `waitingRoom#${newRoomId}`

            roomData.roomId = parseInt(newRoomId);
            roomData.player1 = parseInt(newPlayerId);
            roomData.player2 = "";
            roomData.available = true

            try {
                await RedisClient.save(room_key, roomData)
            } catch (err) {
                return console.log(`An error has occurred: ${err}`)
            }
        }

    } else {

        try {
            var id = await RedisClient.getLastKnownID(isPlayer = false, isGame = false, isBoard = false, isRoom = true);
            var newRoomId = id + 1;
        } catch (err) {
            return console.log(`An error has occurred: ${err}`)
        }

        try {
            await RedisClient.saveID(newRoomId, isPlayer = false, isGame = false, isBoard = false, isRoom = true);
        } catch (err) {
            return console.log(`An error has occurred: ${err}`)
        }

        var room_key = `waitingRoom#${newRoomId}`

        roomData.roomId = parseInt(newRoomId);
        roomData.player1 = parseInt(newPlayerId);
        roomData.player2 = "";
        roomData.available = true

        try {
            await RedisClient.save(room_key, roomData)
        } catch (err) {
            return console.log(`An error has occurred: ${err}`)
        }
    }

    //Save player after set it a room
    player_data.roomId = parseInt(roomData.roomId);

    try {
        var player_response = await RedisClient.save(player_key, player_data)
    } catch (err) {
        return console.log(`An error has occurred: ${err}`)
    }

    //Json with player
    if (player_response) {
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

module.exports = playerRouter;