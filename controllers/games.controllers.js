const { response } = require("express");
// Models
const Game = require("../models/game.model");
const GameInConsole = require( '../models/gameInConsoles' )
const Console = require("../models/console.model");
const Review = require("../models/reviews.model");
// Middlewares
const { tryCatch } = require("../utils/tryCatch");
const { AppError } = require('../utils/AppError');

const getAllGames = tryCatch(async( req, res = response ) => {

    const { limit, offset } = req.query
    const query = { status: "ACTIVE" }

    const [ total, games ] = await Promise.all([
        Game.count({ where: query }),
        Game.findAll({ 
            where: query,
            attributes: [ 'id', 'title', 'genre', 'status' ],
            include: [{
                model: Console,
                attributes: [ 'id', 'name', 'company' ]
            },
            {
                model: Review,
                attributes: [ "userId", "comment" ]
            },
            ],
            limit,
            offset
        })
    ])
    
    res.status( 200 ).json({
        total, 
        games
    })
})

const createGame = tryCatch(async( req, res = response ) => {
    let { ...gameProps }  = req.body

    // Create new user instance and save to DB
    const newGame = await Game.build({ ...gameProps })
    await newGame.save()

    res.status( 200 ).json({
        newGame
    })
})

const updateGame = tryCatch(async( req, res = response ) => {

    const { title } = req.body
    const { gameid } = req.params

    const gameToUpdate = await Game.findOne({ where: {id: gameid} })
    await gameToUpdate.update({ title })

    res.status( 200 ).json({
        gameToUpdate
    })
})

const deleteGame = tryCatch(async( req, res = response ) => {

    const { gameid } = req.params
    const query = { status: "DISABLED" }

    const gameToDelete = await Game.findOne({ where: {id: gameid} })
    await gameToDelete.update( query )

    res.status( 200 ).json({
        gameToDelete
    })
})

const assingGameToConsole = async( req, res = response ) => {

    const { ...gameAndConsoleProps } = req.body

    const newRelation = await GameInConsole.build({ ...gameAndConsoleProps })
    newRelation.save()

    res.status( 200 ).json({
        newRelation
    })
}


// El userId vendra del JWT activo del usuario, entonces no es necesario pasarlo por req.body

const createReview = async( req, res = response, next ) => {

    const { sessionUser } = req
    const { comment } = req.body
    const { gameId } = req.params

    const review = await Review.build({ gameId, userId: sessionUser.uid, comment })
    review.save()

    res.status( 200 ).json({
        review
    }) 
}

module.exports = {
    getAllGames,
    createGame,
    updateGame,
    createReview,
    deleteGame,
    assingGameToConsole,
    createReview
}