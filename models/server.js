const express  = require('express');
const http     = require('http');
const cors     = require('cors')
const socketio = require('socket.io');
const path     = require('path');
const Sockets  = require('./sockets');
const dbConnection = require('../database/config');
const authRoutes = require('../routes/auth.js');

class Server {

    constructor() {

        this.app  = express();
        this.port = process.env.PORT;

        //Conectar a DB
        dbConnection()

        // Http server
        this.server = http.createServer( this.app );
        
        // Configuraciones de sockets
        this.io = socketio( this.server, { 
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"]
            }
         } );
    }

    middlewares() {
        
        this.app.use( express.static( path.resolve( __dirname, '../public' ) ) );

        // CORS
        this.app.use( cors() )

        // BODY PARSE
        this.app.use( express.json() )

        // API ENDPOINTS
        this.app.use( '/api/', authRoutes )

    }

    configurarSockets() {
        new Sockets( this.io );
    }

    execute() {

        // Inicializar Middlewares
        this.middlewares();

        // Inicializar sockets
        this.configurarSockets();

        // Inicializar Server
        this.server.listen( this.port, () => {
            console.log('Server corriendo en puerto:', this.port );
        });
    }

}

module.exports = Server;