const { validationResult } = require("express-validator")
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const { generarJWT } = require("../helpers/jwt")

const registerUser = async (req, res) => {
    
    try {

        const { email, password } = req.body

        const existingEmailCheck = await User.findOne({ email })
        
        if (existingEmailCheck) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya existe'
            })
        }

        // Crear instancia de usuario
        const user = new User( req.body )

        // Encriptar password
        const salt = bcrypt.genSaltSync()
        user.password = bcrypt.hashSync( password, salt )
        
        //Guardar usuario en BD
        await user.save()

        // Generar el JWT
        const token = await generarJWT( user.id )

        res.json({
            ok: true,
            user,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Internal Server Error'
        })
    }
    
}

const login = async (req, res) => {

    const { email, password } = req.body

    try {
        
        // Verificar si existe el correo
        const userInDB = await User.findOne({ email })
        if ( !userInDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Credenciales Incorrectas'
            })
        }

        // Validar el password 
        const validPassword = bcrypt.compareSync( password, userInDB.password )
        if ( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Credenciales Incorrectas'
            })
        }

        // Generar el JWT
        const token = await generarJWT( userInDB.id )

        res.json({
            ok: true,
            user: userInDB,
            token
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Internal Server Error'
        })
    }
}

const renewToken = async (req, res) => {

    const uid = req.uid

    // Generar un nuevo JWT
    const token = await generarJWT( uid )

    // Obtener el usuario por UID
    const user = await User.findById( uid )

    res.json({
        ok: true,
        user,
        token
    })
}

module.exports = {
    registerUser,
    login,
    renewToken,
}