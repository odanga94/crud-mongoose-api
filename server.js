const express = require('express');
const logger = require('morgan');
const errorhandler = require('errorhandler');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
const url = 'mongodb://localhost:27017/edx-course-db';

let app = express();
app.use(logger('dev'));
app.use(bodyParser.json());

mongoose.connect(url, (error) => {
    if (error) {return process.exit(1)}

    let Account = mongoose.model('Account', {
        name: String,
        balance: Number
    });

    app.get('/accounts', (req, res, next) => {
        Account.find({}, (error, accounts) => {
            if (error) return next(error)
            res.send(accounts);
        });   
    });

    app.post('/accounts', (req, res, next) => {
        if(!req.body){return res.sendStatus(400)}
        const newAccount = new Account(req.body);
        newAccount.save((error, results) => {
            if (error) return next(error);
            res.send(results);
        })
    });

    app.put('/accounts/:id', (req, res, next) => {
        if(!req.body){return res.sendStatus(400)}
        Account.update({_id: req.params.id}, {$set: req.body}, (error, results) => {
            if(error){return next(error)}
            res.send(results);
        });
    });

    app.delete('/accounts/:id', (req, res, next) => {
        if(!req.body){return res.sendStatus(400)}
        Account.remove({_id: req.params.id}, (error, results) => {
            if (error) {return next(error)}
            res.send(results);
        })
    });

    app.use(errorhandler());
    app.listen(3000);
})