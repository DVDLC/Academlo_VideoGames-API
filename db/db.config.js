const { Sequelize, DataTypes } = require("sequelize");
require('dotenv').config({ path: `${__dirname}/../config.env` })

const db = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB,
    logging: false,
    // Esta opción nos conecta al https
/*     dialectOptions:
    process.env.NODE_ENV === 'production'?
    {
        
        ssl:{
            required: true,
            rejectUnathorized: false
        }
    } : { } */
})

module.exports = {
    db,
    DataTypes
}