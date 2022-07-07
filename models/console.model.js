const { db, DataTypes } = require("../db/db.config");


const Console = db.define( 'Console', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },
    name: { 
        type: DataTypes.STRING,
        allowNull: false
    },
    company: {
        type: DataTypes.ENUM( 'Sony', 'Microsoft', 'Nintendo' ),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM( "ACTIVE", "DISABLED" ),
        allowNull: false,
        defaultValue: 'ACTIVE'
    }
})

module.exports = Console