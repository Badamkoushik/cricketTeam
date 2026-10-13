const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()
app.use(express.json())
const dbPath = path.join(__dirname, 'cricketTeam.db')
let db = null

//Initialise DB and Server

const initialiseDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error : ${e.message}`)
    process.exit(1)
  }
}
initialiseDBAndServer()

//GET ALL PLAYERS

app.get('/players/', async (request, response) => {
  const getPlayersQuery = `
    SELECT
    player_id AS playerId,
    player_name AS playerName,
    jersey_number AS jerseyNumber,
    role AS role
    FROM
    cricket_team;`
  const playersArray = await db.all(getPlayersQuery)
  response.send(playersArray)
})

//GET A PLAYER

app.get('/players/:playerId', async (request, response) => {
  const {playerId} = request.params
  const getPlayerQuery = `
  SELECT 
  player_id as playerId,
  player_name as playerName,
  jersey_number as jerseyNumber,
  role as role
  FROM 
  cricket_team WHERE player_id = ${playerId};`
  const player = await db.get(getPlayerQuery)
  response.send(player)
})

//POST

app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const addPlayerQuery = `
  INSERT INTO cricket_team (player_name,jersey_number,role) VALUES ('${playerName}',${jerseyNumber},'${role}');`
  const dbResponse = await db.run(addPlayerQuery)
  response.send('Player Added to Team')
})

//PUT

app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const updatePlayerQuery = `
  UPDATE 
  cricket_team 
  SET
  player_name = '${playerName}',
  jersey_number = ${jerseyNumber},
  role = '${role}'
  WHERE player_id = ${playerId};`
  const dbResponse = await db.run(updatePlayerQuery)
  response.send('Player Details Updated')
})

//Delete

app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const deleteQuery = `
  DELETE 
  FROM 
  cricket_team 
  WHERE player_id = ${playerId};`
  const dbResponse = await db.run(deleteQuery)
  response.send('Player Removed')
})

module.exports = app
