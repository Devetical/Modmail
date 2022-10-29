const mongoose = require('mongoose');

module.exports = mongoose.model('User', {
    _id: { type: String, required: true },
    blocked: { type: Boolean, required: true, default: false }
})