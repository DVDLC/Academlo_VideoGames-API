// Libraries
const { response } = require("express");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

// Models
const User = require("../models/user.model");
const Review = require("../models/reviews.model");
const { tryCatch } = require("../utils/tryCatch");


const getActiveUsers = tryCatch(async( req, res = response, next ) => {

    const { limit, offset } = req.query
    const query = { status: "ACTIVE" }

    
    const [ total, users ] = await Promise.all([
        User.count({ where: query }),
        User.findAll({ 
            where: query,
            attributes: [ 'uid', 'name', 'email', 'type', 'status' ],
            include: {
                model: Review,
                attributes: [ "gameId", "comment" ]
            },
            limit,
            offset
        })
    ])
    
    res.status( 200 ).json({
        total, 
        users
    })
})

const createUser = tryCatch(async( req, res = response ) => {

    let { password, ...rest }  = req.body

    // Encrypt password
    const salt = bcrypt.genSaltSync( 10 )
    password = bcrypt.hashSync( password, salt )

    // Create new user instance and save to DB
    const newUser = await User.build({ ...rest, password })
    await newUser.save()

    newUser.password = undefined

    res.status( 200 ).json({
        ok: true,
        newUser
    })
})

const updateUser = tryCatch(async( req, res = response ) => {

    const { name, email } = req.body
    const { uid } = req.params

    if( name.length > 0 ){
        const userToUpdate = await User.findOne({ where: { uid } })
        userToUpdate.update({ name })
    }if( email.length > 0 ){
        const userToUpdate = await User.findOne({ where: { uid } })
        userToUpdate.update({ email })
    } 

    res.status( 200 ).json({
        
        ok: true,
        msg: 'User updated succesfully'
    })
})

const deleteUser = tryCatch(async( req, res = response ) => {

    const { status } = req.body
    const { uid } = req.params

    const userToDelete = await User.findOne({ 
        where: { uid }, 
        attributes: [ 'uid', 'name', 'email', 'type', 'status' ]
    })
    userToDelete.update({ status })

    res.status( 200 ).json({
        userToDelete
    })
})

module.exports = {
    getActiveUsers,
    createUser,
    updateUser,
    deleteUser
}