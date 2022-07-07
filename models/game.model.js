const { db, DataTypes } = require("../db/db.config");


const Game = db.define( 'Game', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    title: { 
        type: DataTypes.STRING,
        allowNull: false
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM( "ACTIVE", "DISABLED" ),
        allowNull: false,
        defaultValue: 'ACTIVE'
    }
})

module.exports = Game