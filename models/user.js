const { Schema, model } = require('mongoose')

const userSchema = Schema({
    
    name: { 
        type: String, 
        required: true 
    },

    email: { 
        type: String, 
        required: true, 
        unique: true 
    },

    password: { 
        type: String, 
        default: null 
    },

    online: { 
        type:Boolean, 
        default: false 
    },

    documents: [{
        type: String
    }]

})

userSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject()
    object.uid = _id
    return object
})

module.exports = model('User', userSchema)