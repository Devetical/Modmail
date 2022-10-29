require('dotenv').config();

require('./modmail/src/index.js')();

if (process.env.LOGVIEWER_ENABLED) {
    require('./logviewer/app.js')();
}