const mongoose = require('mongoose');

module.exports = mongoose.model('Guild', {
    _id: { type: String, required: true },
    prefix: { type: String, required: true, default: '!' },
    setup: { type: Boolean, required: true, default: false },
    managers: { type: Array, required: true, default: [] },
    modmail_role: { type: String, required: true, default: 'not setup' },
    main_category: { type: String, required: true, default: 'not setup' },
    log_channel: { type: String, required: true, default: 'not setup' },
    categories: { type: Array, required: true, default: [] },
    snippets: { type: Array, required: true, default: [] },
    installed_plugins: { type: Array, required: true, default: [] }
})

// plugins structure:
// {
//     name: <plugin name>,
//     git: <github link>,
//     author: <author from github plugin.json>,
//     description: <description from github plugin.json>
// }