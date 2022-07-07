const { response } = require("express");

// Models
const Console = require("../models/console.model");
const Game = require("../models/game.model");
const { tryCatch } = require("../utils/tryCatch");

const getAllConsoles = tryCatch(async( req, res = response ) => {

    const query = { status: "ACTIVE" }
    const [ total, consoles ] = await Promise.all([
        Console.count({ where: query }),
        Console.findAll({ 
            where: query,
            attributes: [ 'id', 'name', 'company' ],
            include: {
                model: Game,
                attributes: [ 'id', 'title', 'genre', 'status' ]
            }
        })
    ]) 

    res.status( 200 ).json({
        total,
        consoles
    })
})

const createConsole = tryCatch(async( req, res = response ) => {
    const { ...consoleProps } = req.body

    const newConsole = await Console.build({ ...consoleProps })
    newConsole.save()

    res.status( 200 ).json({
        newConsole
    })
})

// TODO: No tenemos nah hecho para actualizar xd

const updateInfoConsole = tryCatch(( req, res = response ) => {
    res.status( 200 ).json({
        ok: true,
        msg: 'PATCH - Update consoles info'
    })
})

const deleteConsole = tryCatch(async( req, res = response ) => {
    const { id } = req.params
    const { status } = req.body
    const query = { status }

    const ConsoleToDelete = await Console.findOne({ where: { id }})
    await ConsoleToDelete.update( query )

    res.status( 200 ).json({
        ConsoleToDelete
    })
})

module.exports = {
    getAllConsoles,
    createConsole,
    updateInfoConsole,
    deleteConsole
}