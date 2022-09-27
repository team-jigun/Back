const mongoose = require('mongoose');

const chatLogSchema = new mongoose.Schema({
    sessionId: {
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
    }
});

module.exports = mongoose.model('ChatLogs', chatLogSchema);