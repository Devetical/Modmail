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
    installed_plugins: { type: Array, required: true, default: [] },
    config: { type: Object, required: true, default: {
        // Embed configuration
        user_embed_color: '#37ff77',
        staff_embed_color: '#f7f91a',
        staff_anonymous_author_name: 'Staff Reply',
        staff_anonymous_author_icon: 'https://cdn.discordapp.com/attachments/1013171999788507266/1036448489812533278/0.png',

        // Thread creation configuration
        ping_role_on_thread_creation: true,
        ping_role_on_thread_creation_role: '@here',
        thread_creation_message: 'Thank you for contacting support! A staff member will be with you shortly.',
        fallback_category_id: 'not setup',

        // Thread closing configuration
        thread_close_message: 'This thread has been closed. If you wish to open a new thread, please send a new message.',

        // Thread general configuration
        auto_alert_last_response: false,
    } },
})

// plugins structure:
// {
//     name: <plugin name>,
//     git: <github link>,
//     author: <author from github plugin.json>,
//     description: <description from github plugin.json>
// }