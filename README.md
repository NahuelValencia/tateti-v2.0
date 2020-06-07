# Tateti-v2.0
Game TaTeTi develop with React in the FE and Expressjs/nodejs in the BE

First of all, inside node, create a .env file to set the following environment variables:
  REDIS_HOST=localhost
  REDIS_PORT=9000
  SECRET_KEY=ProgAv2020

## Database: redis

### `docker run --name redis -p 6380:6379 redis` 

## To run the backend (in the node directory):

### `npm run dev`

Open http://localhost:9000

## To run the frontend (in the ui-react directory):

### `npm start`

Open http://localhost:3000

////////////////////////////////////////////////////////////////////

## Using the backend with curl

### Create player
  
  - curl -H 'Authorization: ProgAv2020' -d "name=Nahuel" 127.0.0.1:9000/player -X POST
  
  This returns a player that has a session_token attribute, that it has to be used in every request.
  
  Response i.e:
  {
      "status":200,
      "response":{
            "name":"Nahuel",
            "turn":false,
            "playerId":12,        
   "session_token":"7d073995235eb6c527fbe54392249a00399822282ca5306979d030737da978fbd815db0543ce9bbf5f5ef92bdc273ac11a5e3c1f24b5ad3ef271e6bcc939f10a72853c23097aa79c05f88d40d58af2758446e8e3ea6491f7b9e4b1337a846e1e45408045e46afabdbcee"
            }
      }

### Get available rooms

In order to play, the user has to join a game.

  - curl -H 'Authorization: session_token' 127.0.0.1:9000/room -X GET
  
If there is no room (404), the player should create one.
If there are rooms, the player should join a room.

### Create room

  - curl -H 'Authorization: session_token' -d "playerId=12" 127.0.0.1:9000/room -X POST
  
After create the room, the user waits for 2.5 mins for someone to join the room.

### Check if someone has joined the room

  - curl -H 'Authorization: session_token' 127.0.0.1:9000/room/50 -X GET
  
### Join to a room

  - curl -H 'Authorization: session_token' -d "playerId=15" 127.0.0.1:9000/room/50/join -X POST

Once there are two player in the room, the game is created (when user select play button)

### Create a game

  - curl -H 'Authorization: session_token' -d '{"players": [{"id": 12},{"id": 15}],"roomId":1}' 127.0.0.1:9000/game -X POST
  
  (I was not able to send a "complex" json with curl. Use postman instead)
  
  - With Postman: 127.0.0.1:9000/game  body:{"players": [{"id": 12},{"id": 15}],"roomId":1} header: Authorization -> session_token

### Check game status

When the game has started, every two seconds, we check the status of the game in order to know the player's turn.

  - curl -H 'Authorization: session_token' 127.0.0.1:9000/game/50 -X GET

### Make a movement

  - curl -H 'Authorization: session_token' -d "playerId=114&position=4&gameId=41&boardId=38"  127.0.0.1:9000/game/move -X PUT
  
To draw an X or O in the board

/////////////////////////////////////////////////////////////////

