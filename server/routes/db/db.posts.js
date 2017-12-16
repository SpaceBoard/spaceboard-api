var keystone = require('keystone');

var async = require('async');
var Post = keystone.list('Post');

exports.list = function(config){
    return new Promise(function(resolve, reject){
        
        Post.paginate({
            page: config.page || 1,
            perPage: 10,
            maxPages: 10
        })
        .sort('-publishedDate')
        .find(function(err, items) {
            
            if (err) return reject({ status: 500, err: err });
            resolve(items);

        });

    });
};


/**
 * Get Post by ID
 */
exports.get = function(config) {
	return new Promise(function(resolve, reject){
        
        Post.model.findById(config.id).exec(function(err, item) {
            
            if (err) return reject({ status: 500, err: err });
            if (!item) return reject({ status: 404, err: err });
            
            resolve(item);
            
        });

    });
}


exports.slug = function(config) {
	return new Promise(function(resolve, reject){
        
        Post.model.find({ slug: config.slug }).exec(function(err, item) {
            
            if (err) return reject({ status: 500, err: err });
            if (!item) return reject({ status: 404, err: err });
            
            resolve(item);
            
        });

    });
}


/**
 * Create a Post
 */
exports.post = function(config) {
	
    return new Promise(function(resolve, reject){
        
        var item = new Post.model(),
            data = config.data;

        item.getUpdateHandler(config.req).process(data, function(err) {
            if (err) return reject({ status: 500, err: err });
            resolve(item);
        });

    });
	
}

/**
 * Get Post by ID
 */
exports.update = function(config) {

    return new Promise(function(resolve, reject){
        
        Post.model.findById(config.id).exec(function(err, item) {
            
            if (err) return reject({ status: 500, err: err });
            if (!item) return reject({ status: 404, err: err });
            
            var data = config.data;
            
            item.getUpdateHandler(config.req).process(data, function(err) {
                if (err) return reject({ status: 500, err: err });
                resolve(item);
            });

        });

    });

}

/**
 * Delete Post by ID
 */
exports.remove = function(config) {
	return new Promise(function(resolve, reject){
        
        Post.model.findById(config.id).exec(function(err, item) {
            
            if (err) return reject({ status: 500, err: err });
            if (!item) return reject({ status: 404, err: err });
            
            var data = config.data;
            
            item.remove(function(err) {
                if (err) return reject({ status: 500, err: err });
                resolve({
                    success: true
                });
            });

        });

    });
}

