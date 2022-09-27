const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    users: [{
        id: String,
        permissionKeys: [
            Number
        ]
    }]
});

module.exports = mongoose.model('ChatRoom', chatRoomSchema);