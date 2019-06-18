'use strict';
const config = require('../../config.default');
const jwt = require('jsonwebtoken');
const compose = require('composable-middleware');
const UserModel = require('../../Models/user.model');
const {sendFailureResponse} = require('../../utils/common-response');
const _ = require('lodash');

exports.signToken = function(_id, firstName, lastName, email) {
    return jwt.sign({ _id, firstName, lastName, email }, config.secrets.session, {
        expiresIn: 24 * 60 * 60,
    });
};

exports.isAuthenticated = () => {
    return compose()
        .use((req, res, next) => {
            if (req.headers.authorization) {
                let token = req.headers.authorization;
                jwt.verify(token, config.secrets.session, (err, decodedToken) => {
                    if (err) {
                        if (err.name === 'TokenExpiredError') {
                            return sendFailureResponse(req, res, 'Session time out, please login again!');
                        } else {
                            return sendFailureResponse(req, res, 'Session terminated, Please login again!');
                        }
                    } else {
                        req.decodedToken = decodedToken;
                        next();
                    }
                });
            } else {
                return sendFailureResponse(req, res, 'You are not authenticated for this, please login again!');
            }
        })
        .use((req, res, next) => {
            if (req.decodedToken._id) {
                UserModel.findById(req.decodedToken._id)
                    .then(user => {
                        if (!user) {
                            return sendFailureResponse(req, res, 'Seems you are lost, please sign up or contact our team!');
                        }
                        req.user = _.pick(user, '_id', 'firstName', 'lastName', 'email', 'contactNumber');
                        next();
                    })
                    .catch(err => {
                        console.log(err);
                        return sendFailureResponse(req, res, 'Seems you are lost, please sign up or contact our team!');
                    });
            } else {
                return sendFailureResponse(req, res, 'Server Error! Please contact admin team!');
            }
        });
};
