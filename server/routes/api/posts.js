
var postDB = require('../db/db.posts');

function catchThemAll(errObj){
    if (errObj.status === 500){
        res.status(errObj.status).send({ msg: 'Database error', err: errObj.err });
    }else if (errObj.status === 404){
        res.status(errObj.status).send({ msg: 'Not found', err: errObj.err });
    }else if (errObj.status === 401){
        res.status(errObj.status).send({ msg: 'Not login', err: errObj.err });
    }else if (errObj.status === 402){
        res.status(errObj.status).send({ msg: 'Not enough rights', err: errObj.err });
    }else if (errObj.status === 403){
        res.status(errObj.status).send({ msg: 'Not enough rights', err: errObj.err });
    }else{
        res.status(errObj.status).send({ msg: 'Unknown Error', err: errObj.err });
        console.log(errObj);
    }
}

/**
 * List Posts
 */
exports.list = function(req, res) {
    postDB.list({
        page: req.query.page || 1,
    }).then(function(items){
        res.json(items);
    }).catch(catchThemAll);
}


exports.get = function(req,res){

    postDB.get({
        id: req.params.id
    }).then(function(item){
        res.json(item);
    }).catch(catchThemAll);

};

exports.slug = function(req,res){

    postDB.slug({
        slug: req.params.slug
    }).then(function(item){
        res.json(item);
    }).catch(catchThemAll);

};



exports.post = function(req,res){

    postDB.post({
        req: req,
        data: (req.method.toUpperCase() === 'POST') ? req.body : req.query
    }).then(function(data){
        res.json(data);
    }).catch(catchThemAll);

};


exports.update = function(req,res){

    postDB.update({
        id: req.params.id,
        req: req,
        data: (req.method.toUpperCase() === 'PUT') ? req.body : req.query
    }).then(function(data){
        res.json(data);
    }).catch(catchThemAll);

};


exports.remove = function(req,res){

    postDB.remove({
        id: req.params.id
    }).then(function(data){
        res.json(data);
    }).catch(catchThemAll);

};