// Libraries
const { Router } = require("express");
const { check } = require("express-validator");
// Controllers
const { getAllConsoles, 
    createConsole, 
    updateInfoConsole, 
    deleteConsole } = require("../controllers/console.controllers");
const { protectSession } = require("../middlewares/auth.middlewares");
// Middlewares
const { validateConfig } = require("../middlewares/validators.middlewares");

const router = Router()

router.get( '/', getAllConsoles )


router.use( protectSession )

router.post( '/', [
    check( 'name', 'name is required' ).not().isEmpty(),
    check( 'company', 'company is required' ).not().isEmpty(),
    validateConfig
], createConsole )

router.patch( '/:id', [
    check( 'name', 'name is required' ).not().isEmpty(),
], updateInfoConsole )

router.delete( '/:id', deleteConsole )

module.exports = router