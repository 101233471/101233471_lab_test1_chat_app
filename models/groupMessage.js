const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupMessageSchema = new Schema({
    from_user: {
        type: String
    },
    room: {
        type: String
    },
    message: {
        type: String
    },
    date_sent: {
        type: Date
    }
});

module.exports = mongoose.model('GroupMessage', groupMessageSchema);