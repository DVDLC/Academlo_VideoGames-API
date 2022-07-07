const { db, DataTypes } = require("../db/db.config");


const Review = db.define( 'Review', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    userId: { 
        type: DataTypes.INTEGER,
        allowNull: false
    },
    gameId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    comment:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM( "ACTIVE", "DISABLED" ),
        allowNull: false,
        defaultValue: 'ACTIVE'
    }
})

module.exports = Review