const { connectedUser } = require('../controllers/sockets')
const { checkJWT } = require('../helpers/jwt')
const Document = require('../models/document')

const findOrCreateDocument = async ( id ) => {
    if (id == null) return
    
    const document = await Document.findById(id)
    if (document) return document
    return await Document.create({ _id: id, data: ""})
}

class Sockets {

    constructor( io ) {

        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        // On connection
        this.io.on('connection', async ( socket ) => {
            
            socket.on('get-document', async ( documentID ) => {
                const document = await findOrCreateDocument( documentID )
                socket.join( documentID )
                socket.emit("load-document", document.data)
                
                socket.on('send-changes', (delta) => {
                    socket.broadcast.to( documentID ).emit("receive-changes", delta)
                })
                
                socket.on('save-document', async ( data ) => {
                    console.log(data)
                    await Document.findByIdAndUpdate( documentID, { data } )
                })
            
            });

            socket.on('disconnect', () => {
                console.log('Cliente desconectado')
            })
            
        });
    }

    
}


module.exports = Sockets;