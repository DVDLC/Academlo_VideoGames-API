const { Router } = require("express");
// Libraries
const { body } = require("express-validator");
// Controllers
const { getAllGames, 
    createGame, 
    updateGame, 
    deleteGame, 
    createReview,
    assingGameToConsole } = require("../controllers/games.controllers");
// Middlewares
const { gameExists } = require("../middlewares/game.middlewares");
const { validateConfig } = require("../middlewares/validators.middlewares");
const { consoleExist } = require("../middlewares/console.middlewares");
const { protectSession, verifyIfUserisAdmin } = require("../middlewares/auth.middlewares");
const { verifyIfUserAlreadyReviewGame } = require("../middlewares/user.middlewares");

const router = Router()

router.get( '/', getAllGames )

// En este apartado tenemos que ver que el usuario sea valido( "ADMIN" )

router.use( protectSession ) 

router.post( '/', [
    verifyIfUserisAdmin,
    body( 'title', 'The title is required' ).not().isEmpty(),
    body( 'genre', 'Genre is required').not().isEmpty(),
    validateConfig
], createGame )

router.patch( '/:gameid',[
    verifyIfUserisAdmin,
    body( 'title', 'The title is required' ).not().isEmpty(),
    validateConfig
], updateGame )

router.delete( '/:gameid',verifyIfUserisAdmin, deleteGame )

router.post( '/assign-game', [
    verifyIfUserisAdmin,
    body( 'gameId' ).custom( gameExists ),
    body( 'consoleId' ).custom( consoleExist ),
    validateConfig
], assingGameToConsole )

router.post( '/reviews/:gameId', verifyIfUserAlreadyReviewGame, createReview )

module.exports = router