const { db, DataTypes } = require("../db/db.config");


const GameInConsole = db.define( 'GameInConsole', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    gameId: { 
        type: DataTypes.INTEGER,
        allowNull: false
    },
    consoleId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM( "ACTIVE", "DISABLED" ),
        allowNull: false,
        defaultValue: 'ACTIVE'
    }
})

module.exports = GameInConsole