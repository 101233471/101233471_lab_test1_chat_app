const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const privateMessageSchema = new Schema({
    from_user: {
        type: String
    },
    to_user: {
        type: String
    },
    message: {
        type: String
    },
    date_sent: {
        type: String
    }
});

module.exports = mongoose.model('PrivateMessage', privateMessageSchema);