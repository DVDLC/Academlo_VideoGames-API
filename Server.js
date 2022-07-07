// Libraries
const express = require('express')
// utils
const { db } = require('./db/db.config')
// Models
const Console = require('./models/console.model')
const Game = require('./models/game.model')
const Review = require('./models/reviews.model')
const User = require('./models/user.model')
// Middleware
const { AppError } = require('./utils/AppError')
const { globalErrorHandler } = require('./middlewares/globalError.middleware')

class Server{
    constructor(){
        this.PORT= process.env.PORT || 4000
        this.app = express()
        this.path = {
            users: '/api/v1/users',
            games: '/api/v1/games',
            consoles: '/api/v1/consoles',
            auth: '/api/v1/auth',
            error: '*'
        }

        // DB connection
        this.DBconnection()

        // Middlewares
        this.middlewares()

        // Routes
        this.routes()

        // Not found
        this.notFound()

        // Error handler
        this.errorHandler()

    }

    middlewares(){
        this.app.use( express.json() )
    }

    routes(){
        this.app.use( this.path.users, require( './routes/users.routes' ) )
        this.app.use( this.path.games, require( './routes/games.routes' ) )
        this.app.use( this.path.consoles, require( './routes/consoles.routes' ) )
        this.app.use( this.path.auth, require( './routes/auth.routes' ) )
    }

    notFound(){
        this.app.all( this.path.error, (req, res, next) => {
            next(
                new AppError(
                    404,
                    `${req.method} ${req.originalUrl} not found in this server`
                )
            );
        })
    }

    errorHandler(){
        this.app.use( globalErrorHandler )
    }

    listen(){
        this.app.listen( this.PORT , () => {
            console.log( `Server running at port: ${ this.PORT }` )
        })
    }

    async DBconnection(){
        try{
            await Promise.all([
                db.authenticate(),
                db.sync({ /* force: true */ })
            ])

            // DB Relations
            User.hasMany( Review, { foreignKey: 'userId' } )
            Review.belongsTo( User, { foreignKey: 'userId' })

            Game.hasMany( Review, { foreignKey: 'gameId' } )
            Review.belongsTo( Game, { foreignKey: 'id' })

            Game.belongsToMany( Console, { through: 'GameInConsole', foreignKey: 'gameId' } )
            Console.belongsToMany( Game, { through: 'GameInConsole', foreignKey: 'consoleId' } )

            console.log( 'Database authenticated and sync' )
        }catch( err ){
            console.log( 'Error to connect to DB' ) 
        }
    }
}

module.exports = Server