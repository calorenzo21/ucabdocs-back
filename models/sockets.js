const { connectedUser, disconnectedUser } = require('../controllers/sockets')
const { checkJWT } = require('../helpers/jwt')
const Document = require('../models/document')
const user = require('./user')

const findOrCreateDocument = async ( id ) => {
    if (id == null) return
    
    const document = await Document.findById(id)
    if (document) return document
    return await Document.create({ _id: id, data: ""})
}

const addDocument = async (userId, documentId) => {
    try {
        const usuario = await user.findById(userId);

        if (!usuario) {
            console.log('Usuario no encontrado');
            return;
        }

        // Verificar si el documento ya existe en el arreglo 'documents'
        if (usuario.documents.includes(documentId)) {
            console.log('El documento ya está asociado al usuario.');
            return;
        }

        // Si no existe, agregar el documentId al arreglo 'documents'
        usuario.documents.push(documentId);

        // Guardar los cambios en la base de datos
        await usuario.save();
        console.log('Documento añadido correctamente al usuario');
    } catch (error) {
        console.error('Ocurrió un error al añadir el documento al usuario:', error);
    }
}


class Sockets {

    constructor( io ) {

        this.io = io;

        this.socketEvents();
    }

    socketEvents() {
        // On connection
        this.io.on('connection', async ( socket ) => {
            
            const [ valido, uid ] = checkJWT( socket.handshake.query['x-token'] )

            if (!valido) {
                console.log('socket no identificado')
                return socket.disconnect()
            }
            
            socket.on('get-document', async ( documentID ) => {
                const document = await findOrCreateDocument( documentID )
                socket.join( documentID )
                await addDocument (uid , documentID)
                socket.emit("load-document", document.data)
                socket.broadcast.to( documentID ).emit("active-user", await connectedUser( uid ))
                
                socket.on('send-changes', (delta) => {
                    socket.broadcast.to( documentID ).emit("receive-changes", delta)
                })
                
                socket.on('save-document', async ( data ) => {
                    console.log(data)
                    await Document.findByIdAndUpdate( documentID, { data } )
                })
            
            });

            socket.on('disconnect', async () => {
                await disconnectedUser( uid )
            })
            
        });
    }

    
}


module.exports = Sockets;