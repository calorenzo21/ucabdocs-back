const User = require('../models/user')

const connectedUser = async ( uid ) => {

    const user = await User.findById(uid)
    user.online = true
    await user.save()
    return user.name
}

module.exports = {
    connectedUser
}