// Libraries
const { Router } = require("express");
const { check } = require("express-validator");
// Controllers
const { login } = require("../controllers/auth.controlles");
// Middlewares
const { validateConfig } = require("../middlewares/validators.middlewares");
const { authLoginEmail } = require("../middlewares/user.middlewares");

const router = Router()

router.post( '/login', [
    check( 'email', 'email is required' ).not().isEmpty(),
    check( 'email', 'The email address is incorrect' ).isEmail().custom( authLoginEmail ),
    check( 'password', 'password is required' ).not().isEmpty(),
    validateConfig
], login )

module.exports = router 