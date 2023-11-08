const { Schema, model } = require('mongoose')

const documentSchema = Schema({
    
    _id: {
        type: String,
    },
    
    data: {
        type: Object,
    }

})

documentSchema.method('toJSON', function() {
    const { __v,  ...object } = this.toObject()
    return object
})

module.exports = model('Document', documentSchema)