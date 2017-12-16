var keystone = require('keystone'),
    middleware = require('./middleware'),
    importRoutes = keystone.importer(__dirname);

		var fs = require('fs');

var inmem = require('../inmem.js')
var multer  = require('multer')

var storage = multer.memoryStorage()
var upload = multer({ storage: storage })


// Common Middleware
// keystone.pre('routes', middleware.initErrorHandlers);
// keystone.pre('routes', middleware.initLocals);
// keystone.pre('render', middleware.flashMessages);

// Handle 404 errors
// keystone.set('404', function(req, res, next) {
//     res.notfound();
// });

// Handle other errors
// keystone.set('500', function(err, req, res, next) {
//     var title, message;
//     if (err instanceof Error) {
//         message = err.message;
//         err = err.stack;
//     }
//     res.err(err, title, message);
// });

//Load Routes
var routes = {
    api: importRoutes('./api')
};

// Bind Routes
exports = module.exports = function(app) {

    app.all('/api*', keystone.middleware.api);

    app.all('/*', function(req, res, next){
    	if (process.env.NODE_ENV === 'production'){
			if (req.headers.origin === 'https://wonglok.com'){
				res.setHeader('Access-Control-Allow-Origin', 'https://wonglok.com');
			} else if (req.headers.origin === 'https://vue-lok-lok-academy.herokuapp.com') {
				res.setHeader('Access-Control-Allow-Origin', 'https://vue-lok-lok-academy.herokuapp.com');
			} else {
				res.setHeader('Access-Control-Allow-Origin', 'https://wonglok.com');
			}
		}else{
			res.setHeader('Access-Control-Allow-Origin', '*');
		}

		res.setHeader('Access-Control-Allow-Methods', 'DELETE, PUT, POST, GET, OPTIONS');
		res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
		next();
    });

	//fake login logout
	app.post('/api/login', function (req, res) {
		if (req.body.username === 'demo' && req.body.password === 'demo') {
			req.session.authUser = { username: 'demo' }
			return res.json({ username: 'demo' })
		}
		res.status(401).json({ error: 'Bad credentials' })
	})
	app.post('/api/logout', function (req, res) {
		delete req.session.authUser
		res.json({ ok: true })
	})

    app.get('/api/posts', routes.api.posts.list);
	app.get('/api/posts/:id', routes.api.posts.get);
	app.get('/api/slug/:slug', routes.api.posts.slug);

	app.post('/api/posts', middleware.requireAdmin, routes.api.posts.post);
	app.put('/api/posts/:id', middleware.requireAdmin, routes.api.posts.update);
	app.delete('/api/posts/:id', middleware.requireAdmin, routes.api.posts.remove);

	app.get('/api/space/demo', (req, res) => {
		var ans = inmem.onReadRoot()
		res.json(ans)
	})

	app.get('/api/space/:spaceID/file/:fileID', (req, res) => {
		// console.log(req.params)
		var ans = inmem.readFile({ spaceID: req.params.spaceID, fileID: req.params.fileID })
		if (!ans) {
			res.status(404).send({
				file: 'item not found'
			})
		} else {
			// res.status(200).send(fs.readFileSync(ans.path))
			res.status(200).download(ans.path, ans.originalname)
		}
	})

	app.options('/api/space/:spaceID/file/:fileID', (req, res) => {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.status(200).send();
	})

	app.post('/api/space/:spaceID/file/:fileID', upload.single('media'), (req, res) => {
		var fileData = req.files.media
		var ans = inmem.writeFile({ spaceID: req.params.spaceID, fileID: req.params.fileID, fileData })
		console.log(req.params)
		res.json({
			status: 'ok'
		})
	})

	// app.use('/', function(req, res, next){
	// 	var isUnCache = (typeof req.query['__uncache'] !== 'undefined');
	// 	if (isUnCache){
	// 		res.status(200).json({
	// 			ok: true
	// 		});
	// 	}else{
	// 		next();
	// 	}
	// });

    app.get('/', function(req, res){
        res.status(200).json({ status: 'ready' });
    });
    // app.get('/', routes.views.index);

};
