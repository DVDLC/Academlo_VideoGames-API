const Review = require("../models/reviews.model")
const User = require("../models/user.model")
const { AppError } = require("../utils/AppError")
const { tryCatch } = require("../utils/tryCatch")

// User middlewares

const userExists = tryCatch( async( req, res, next ) => {
    const { uid } = req.params

    const user = await User.findOne({ where: { uid } })
    if( !user ){
        return next( new AppError( 404, 'User not found' ) )
    }

    req.user = user
    next()
})

const verifyIfUserAlreadyReviewGame = async( req, res, next ) => {
    
    const { sessionUser } = req
    const { gameId } = req.params

    const reviewIsAlreadyExist = await Review.findOne({
        where: { userId: sessionUser.uid, gameId },
        attributes: [ "id", "userId", "gameId", "comment", "status" ]
    })
    if( reviewIsAlreadyExist ) return next( new AppError( 401, 'You already generate a review' ) )

    next()
}

const verifyEmail = async( email ) => {

    if( email.length > 0 ){
        const isEmail = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test( email )
        const emailExists = await User.findOne({ where: { email } })
        if( !isEmail ) throw new Error( 'The email address is incorrect' )
        if( emailExists ) throw new Error( 'The email address already exist' )

        
    }
}

const verifyPostEnum = ( type ) => {
    const userTypes = User.getAttributes().type.values 
    console.log( userTypes.includes( type ) ) 
    if( !userTypes.includes( type ) ) throw new Error( `${ type } is not a valid value` )
}

// Auth middlewares

const authLoginEmail = async( email ) => {
    const emailExists = await User.findOne({ where: { email } })
    if( !emailExists ) throw new Error( `Incorrect email` )
}


module.exports = {
    userExists,
    verifyEmail,
    verifyPostEnum,
    authLoginEmail,
    verifyIfUserAlreadyReviewGame
}