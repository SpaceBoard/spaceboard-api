
exports = module.exports = function(){
	var inmem = require('../inmem');

	var keystone = require('keystone');

	var io = keystone.get('io');

	var expressSession = keystone.expressSession;

	io.use(function(socket, next){
		expressSession(socket.handshake, {}, function() {
			var userID = socket.handshake.session.userId;

			if (userID){
				keystone.list('User').model.findOne({ _id: userID }).select('-password').exec(function(err, user) {
					socket.handshake.session.user = user;
					next();
				});
				// next();
			}else{
				next();
			}
		} );
	});

	io.on('connection', function(socket){

		var session = socket.handshake.session;
		console.log('--- User connected');
		// socket.emit('action', { type: 'WS_WELCOME', data: 'Welcome!' });

		socket.on('up/counter', function(data) {
			data.serverData = Math.random();
			data.user = session.user;
			socket.emit('dn/counter', data);
		});

		socket.join('spaceboard', function(){});

		socket.on('up/join/space', function(data) {
			console.log('joined at', data.spaceID);
			socket.join(data.spaceID, function(){});
		})

		socket.on('up/spaceboard', function(data) {
			// if (session.user && session.user.isAdmin){

				// console.log(data);
				// data.random = Math.random();
				// data.user = session.user;
				socket.broadcast.to(data.spaceID || 'spaceboard').emit('dn/spaceboard', data);
			// }
		});

		[
			'files',
			'drawboards',
			'textBoxes',
			'commentBoxes'
		].forEach((arrayName) => {
			socket.on('up/space@update/' + arrayName, function(data) {
				inmem.onUpdate({ data })
				console.log(data)
				socket.broadcast.to(data.spaceID || 'spaceboard').emit('dn/space@update/' + arrayName, data);
			});
			socket.on('up/space@add/' + arrayName, function(data) {
				inmem.onAdd({ data })
				console.log(data)
				socket.broadcast.to(data.spaceID || 'spaceboard').emit('dn/space@add/' + arrayName, data);
			});
			socket.on('up/space@remove/' + arrayName, function(data) {
				inmem.onRemove({ data })
				console.log(data)
				socket.broadcast.to(data.spaceID || 'spaceboard').emit('dn/space@remove/' + arrayName, data);
			});
		})
		socket.on('up/space@attention', function (data) {
			console.log(data)
			socket.broadcast.to(data.spaceID || 'spaceboard').emit('dn/space@attention', data);
		})
		//

		socket.on('disconnect', function(){
			console.log('--- User disconnected');
		});

	});


};
