// Libraries
const { response } = require("express");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
//Models
const User = require("../models/user.model");
// Middleware
const { AppError } = require("../utils/AppError");
const { tryCatch } = require("../utils/tryCatch");


const login = tryCatch(async( req, res = response, next ) => {

    const { email, password } = req.body

    const userLogin = await User.findOne({ 
        where: { email },
        attributes: [ 'uid', 'name', 'email', 'type', 'status', 'password' ]
    })

    // Verify if password is correct
    const isPasswordCorrect = bcrypt.compareSync( password, userLogin.password )
    if( !isPasswordCorrect ) {
        return next( new AppError( 401 , 'The password is incorrect' ) )
    }

    // Hidden password to client
    userLogin.password = undefined

    const payload = { id: userLogin.uid }
    const token = await jwt.sign( 
        payload, 
        process.env.JWT_SECRETKEY,
        { expiresIn: '12h' } 
    )

    res.status( 200 ).json({
       userLogin,
       token
    })
})

module.exports = {
    login
}