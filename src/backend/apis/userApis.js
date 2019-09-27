const User = require("../schemas/users");
const ServiceArea = require("../schemas/serviceArea");
const createError = require('http-errors');

module.exports = function (app, passport) {
    //Checking if user email already exists in the database
    app.get('/userApi/email/:email', function(req, res){
        User.findOne({'profile.email': req.params.email}, function(err, email){
            if(email){
                res.send({
                    status: 400,
                    errorMsg: 'duplicate email'
                });
            }else{
                res.send({
                    status: 200,
                });
            }
        })
    });

    app.post('/userApi/register', function(req, res, next){
        passport.authenticate('local-signup', function (err, user, info) {
            if (err) {
                console.log(err);
                return res.status(402).send(err);
            }
            if (!user) {
                return res.status(401).send(err);
            }else{
                return res.status(200).send({
                    user: user,
                    auth: true
                });
            }

        })(req, res, next);

    });

    app.post('/userApi/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
            if (err) {
                return res.status(err.status).send(err.message);
            }

            if (!user) {
                console.log(err);
                return res.status(err.status).send(err.message);

            }else{
                return res.status(200).send({
                    user: user,
                    auth: true
                });
            }
        })(req, res, next);
    });

    app.get('/userApi/loggedIn', function(req, res){
        if(req.user){
            res.status(200).send({
                auth: true,
                user: req.user
            });
        }else{
            // let err = createError(404, "user not logged in");
            return res.status(404).send("user not logged in");
        }
    });

    app.get('/userApi/logout', function(req, res){
        req.logout();
        res.status(200).send({
            auth: false,
            user: {}
        });
    });

    app.post("/userApi/:id/serviceArea/create", function(req, res){
        const serviceBox = new ServiceArea(req.body);

        const query = {"_id": Object(req.params.id)};
        const newvalues = { $push: {"serviceAreas": serviceBox }};

        User.updateOne(query, newvalues, function(err, res){
            if(err){
                console.log(err);
                // res.send({
                //     status: false,
                //     error: err
                // });
            }else{
                console.log("good");
                // res.send({
                //     status: true,
                //     orderHistory: orders
                // });
            }
        });

        // serviceBox.save(function(err){
        //     if(err){
        //         res.send(err);
        //     }else{
        //         res.send('success');
        //     }
        // })
    });
};
