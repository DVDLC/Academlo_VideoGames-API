const { db, DataTypes } = require("../db/db.config");


const User = db.define( 'User', {
    uid: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false
    },
    name: { 
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    type: {
        type: DataTypes.ENUM( "USER", "SALES", "ADMIN" ),
        allowNull: false,
        defaultValue: 'USER'
    },
    status: {
        type: DataTypes.ENUM( "ACTIVE", "DISABLED" ),
        allowNull: false,
        defaultValue: 'ACTIVE'
    }
})

module.exports = User