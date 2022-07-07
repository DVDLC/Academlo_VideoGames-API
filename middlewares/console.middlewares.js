const Console = require("../models/console.model")
const { tryCatch } = require("../utils/tryCatch")

const consoleExist = async( consoleId ) => {
    const isConsoleExist = await Console.findOne({ where: { id: consoleId } })
    if( !isConsoleExist ) throw new Error( "The console you are looking for doesn't exists in DB" )
}

module.exports = {
    consoleExist
}