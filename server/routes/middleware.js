
/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/keystone/signin');
	} else {
		next();
	}
};


exports.requireAdmin = function (req, res, next){
	if (!req.user || !req.user.isAdmin) {
		res.status(402);
		res.send({ msg: 'require admin' });
	} else {
		next();
	}
};
