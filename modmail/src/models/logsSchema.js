const mongoose = require('mongoose');

module.exports = mongoose.model('Log', {
    _id: { type: String, required: true },
    user: { type: String, required: true },
    messages: { type: Array, required: true, default: [] },
    subscribed: { type: Array, required: true, default: [] },
    alert: { type: Array, required: true, default: [] }
})

// message structure:
// {
//     user: <user object>,
//     avatar: <avatar url>,
//     timestamp: <timestamp>,
//     internal: <boolean>,
//     content: <content>
// }