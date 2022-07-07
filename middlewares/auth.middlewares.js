// Libraries
const jwt = require( 'jsonwebtoken' )
// Models
const User = require("../models/user.model");
// Utils
const { AppError } = require("../utils/AppError");
const { tryCatch } = require("../utils/tryCatch");

const protectSession = tryCatch( async( req, res, next ) => {

    const { authorization } = req.headers
    let token;

    // Verify if token is valid and active
    if( authorization && authorization.startsWith( 'Bearer' ) ){
        token = authorization.split( " " )[1]    
    }

    if( !token ){
        return next( new AppError( 403, 'Invalid token :D' )) 
    }

    const { id } = jwt.verify( token, process.env.JWT_SECRETKEY )
    const verifedUser = await User.findOne({ where: { uid: id, status: 'ACTIVE' } })

    if( !verifedUser ) {
        return next( new AppError( 403, 'the owner of this token is not valid' ) )
    }

    req.sessionUser = verifedUser
    next()
})

const verifyIfUserisAdmin = ( req, res, next ) => {
    const { sessionUser } = req
    
    if( sessionUser.type !== 'ADMIN' ){
        return next( new AppError( 403, 'You are not available to do this' ) )
    }
    next()
}


const protectUserAccount =  async( req, res, next ) => {

    // Get user session ID
    const { sessionUser, user } = req

    if( sessionUser.uid !== user.uid ) return next( new AppError( 403, 'You do not the owner of this account' ) )

    next()
}

module.exports = {
    protectSession,
    protectUserAccount,
    verifyIfUserisAdmin
}