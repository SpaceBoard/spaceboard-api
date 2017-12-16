var socketio = require('socket.io');
var startSocket = require('./socket');

var keystone = require('keystone');
keystone.init({

  'name': 'SpaceBoard',
  'brand': 'SpaceBoard',

//   'favicon': 'public/favicon.ico',
//   'less': 'public',
  'static': ['static'],

//   'views': 'templates/views',
//   'view engine': 'jade',

  'auto update': true,
  mongo: process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost/wonglok-keystone-clean',

  'session': true,
  'session store': 'mongo',
  'file limit': '1024MB',

  'auth': true,
  'user model': 'User',
  'cookie secret': process.env.COOKIE_SECRET || '3808ae7a5b61a65d26447c301146b9ad5c80f27aec1ddac79f6a02549a8e29f2036936880e742d1e28a71928fc0659c7b4d204b871b1df3a7151ec4ebd8e2b28',
});

// keystone.set('cloudinary config', process.env.CLOUDINARY_URL );

keystone.import('./models');

keystone.set('routes', require('./routes'));

keystone.start({
    onHttpServerCreated: function(){
        keystone.set('io', socketio.listen(keystone.httpServer));
    },
    onStart: function(){
    	  startSocket();
    }
});

