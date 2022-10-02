const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true,
        index: true,
    },
    userId: {
        type: String,
        required: true,
        index: true
    },
    username: {
        type: String
    },
    message: {
        type: String
    },
    sendTime: {
        type : Date, default: Date.now
    }
});

module.exports = mongoose.model('ChatLogs', chatLogSchema);