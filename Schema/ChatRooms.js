const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    users: [{
        id: {
            type: String, 
            required: true,
            index: true
        },
        name: {
            type: String
        },
        permission: {
            type: Number, 
            enum: [1, 2, 3, 4, 5]
        }
    }]
});

module.exports = mongoose.model('ChatRoom', chatRoomSchema);