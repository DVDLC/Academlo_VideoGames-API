// Libraries
const { Router } = require("express");
const { check } = require("express-validator");
// Controllers
const { getActiveUsers, 
    createUser, 
    updateUser, 
    deleteUser } = require("../controllers/user.controllers");
// Middlewares
const { validateConfig } = require("../middlewares/validators.middlewares");
const { protectSession, protectUserAccount, verifyIfUserisAdmin } = require("../middlewares/auth.middlewares");
const { verifyEmail, verifyPostEnum, userExists } = require("../middlewares/user.middlewares");

const router = Router()

router.post( '/', [
    check( 'name', 'name is required' ).not().isEmpty(),
    check( 'email', 'email is required' ).custom( verifyEmail ),
    check( 'password', 'password is required' ).not().isEmpty(),
    /* check( 'type' ).custom( verifyPostEnum ), */ // TODO: No entiendo porque no funciona 
    validateConfig
], createUser )

/* 
    Esto me ayuda a que protect session lo ejecuten todos los endpoints que estan por debajo del mismo,
    es por eso que post va arriba 
*/
router.use( protectSession )

router.get( '/', getActiveUsers )

router.patch( '/:uid', [
    userExists,
    protectUserAccount
], updateUser )

router.delete( '/:uid', [
    userExists,
    protectSession,
    verifyIfUserisAdmin
], deleteUser )

module.exports = router