const Game = require("../models/game.model")
const { tryCatch } = require("../utils/tryCatch")

const gameExists =async( gameId ) => {
    const isGameExists = await Game.findOne({ where: { id: gameId } })
    if( !isGameExists ) throw new Error( "The game you are looking for doesn't exists in DB" )
}

module.exports = {
    gameExists
}