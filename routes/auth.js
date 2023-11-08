const { Router } = require('express')
const { check } = require('express-validator')
const { validateFields } = require('../middlewares/validateFields')
const { validateJWT } = require('../middlewares/validateJWT')

const { 
    login, 
    registerUser, 
    renewToken
} = require('../controllers/auth')


const router = Router()

// Crear nuevos usuarios
router.post('/register', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('name', 'El name es obligatorio').not().isEmpty(),
    validateFields
] ,registerUser)

// Login
router.post('/login', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validateFields
],login)

// Revalidar Token
router.get('/renew', validateJWT, renewToken)

module.exports = router