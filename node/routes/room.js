var express = require('express');
var roomRouter = express.Router();
var HttpStatus = require('http-status-codes');

var message = require('../utils/responseConstants');
const Cryptr = require('cryptr');

var RedisClient = require('../database/redis_adapter');

//GET
roomRouter.get('/', async function(req, res, next) {

    //validate token
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

    //get available rooms
    try {
        var allRooms = await RedisClient.getAll("waitingRoom#*");
    } catch (err) {
        return console.log(`An error has occurred: ${err}`)
    }

    var availableRooms = new Array();
    //check if there are some rooms
    if (allRooms.length > 0) {
        console.log(`Rooms \n ${allRooms}`);

        for (roomId of allRooms) {

            try {
                var room = await RedisClient.searchById(roomId)
            } catch (err) {
                return console.log(`An error has occurred: ${err}`)
            }

            //check if the room is available
            if (room.available == "true") {
                availableRooms.push(room);
            }
        }

        //return a list of available rooms and an empty list when there is no available rooms
        return res.json({
            status: HttpStatus.OK,
            response: availableRooms

        })
    } else {
        return res.json({
            status: HttpStatus.NOT_FOUND,
            response: message.notFound

        })
    }

})

roomRouter.get('/:idRoom', async function(req, res, next) {
    //validate token
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

    var room_key = `waitingRoom#${req.params.idRoom}`
    try {
        var room = await RedisClient.searchById(room_key)
        console.log(`Room ready`)
        console.log(room)
    } catch (error) {
        return console.log(`An error has occurred: ${error}`)
    }

    if (room) {
        return res.json({
            status: HttpStatus.OK,
            response: room
        });
    } else {
        return res.json({
            status: HttpStatus.NOT_FOUND,
            response: message.notFound
        });
    }
})

//POSTS
roomRouter.post('/', async function(req, res, next) {
    //validate token
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

    /*
    CREATE WAITING ROOM
    */

    var roomData = {};

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
    roomData.player1 = parseInt(req.body.playerId);
    roomData.player2 = "";
    roomData.available = true

    try {
        var room_saved = await RedisClient.save(room_key, roomData)
    } catch (err) {
        return console.log(`An error has occurred: ${err}`)
    }

    //Json with room
    if (room_saved) {
        res.json({
            status: HttpStatus.OK,
            response: roomData
        });
    } else {
        res.json({
            status: HttpStatus.BAD_REQUEST,
            response: message.cantCreate + error
        });
    }
});


roomRouter.post('/:idRoom/join', async function(req, res, next) {
    //validate token
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

    /*
    JOIN TO A WAITING ROOM
    */
    var room_key = `waitingRoom#${req.params.idRoom}`

    try {
        var room = await RedisClient.searchById(room_key)
        console.log("asd")
        console.log(room)
    } catch (err) {
        return console.log(`An error has occurred: ${err}`)
    }

    //check if the room is available
    if (room.available == "false") {
        return res.json({
            status: HttpStatus.BAD_REQUEST,
            response: message.busyRoom
        });
    }

    room.player2 = parseInt(req.body.playerId)
    room.available = false

    //update room
    try {
        var room_updated = await RedisClient.update(room_key, room, isPlayer = false, isGame = false, isBoard = false, isRoom = true);
    } catch (err) {
        return console.log(`An error has occurred: ${err}`)
    }

    //Json with room
    if (room_updated) {
        res.json({
            status: HttpStatus.OK,
            response: room
        });
    } else {
        res.json({
            status: HttpStatus.BAD_REQUEST,
            response: message.cantUpdate + error
        });
    }
});
module.exports = roomRouter;