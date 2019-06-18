'use strict';

const UserModel = require('../../Models/user.model');
const bcrypt = require('bcrypt');
const {signToken} = require('./auth.service');
const _ = require('lodash');
const {sendFailureResponse} = require('../../utils/common-response');
const validator = require('validator');

exports.isExistingUser = async (req, res) => {
    try {
        if (!req.body.contactNumber || !validator.trim(req.body.contactNumber)) {
            throw new Error('Contact Number is required!');
        }
        if (!validator.isMobilePhone(validator.trim(req.body.contactNumber))) {
            throw new Error('Contact Number is not valid!');
        }
        let user = await UserModel.findOne({contactNumber: validator.trim(req.body.contactNumber)});
        if (user) {
            return res.json({
                success: true,
                isExistingUser: true
            })
        } else {
            return res.json({
                success: true,
                isExistingUser: false
            })
        }
    } catch (e) {
        return sendFailureResponse(req, res, e.message.toString());
    }
};

exports.signUp = async (req, res) => {
    try {
        if (!req.body.firstName || !validator.trim(req.body.firstName)) {
            throw new Error('First Name is required!')
        }
        if (!req.body.email || !validator.trim(req.body.email)) {
            throw new Error('Email is required!');
        }
        if (!validator.isEmail(req.body.email)) {
            throw new Error('Email is not valid!');
        }
        if (!req.body.contactNumber || !validator.trim(req.body.contactNumber)) {
            throw new Error('Contact Number is required!');
        }
        if (!validator.isMobilePhone(validator.trim(req.body.contactNumber))) {
            throw new Error('Contact Number is not valid!');
        }
        if (!req.body.password || !validator.trim(req.body.password)) {
            throw new Error('Password is required!');
        }
        let user = await UserModel.findOne({contactNumber: req.body.contactNumber});
        if (!user) {
            let userObject = {
                firstName: validator.trim(req.body.firstName),
                email: validator.trim(req.body.email),
                contactNumber: validator.trim(req.body.contactNumber),
            };
            if (req.body.lastName && validator.trim(req.body.lastName)) {
                userObject.lastName = validator.trim(req.body.lastName)
            }
            userObject.password = await bcrypt.hash(req.body.password, 8);
            let _user = await new UserModel(userObject).save();
            let token = signToken(_user._id, _user.firstName, _user.email, _user.contactNumber);
            return res.json({
                success: true,
                token: token,
                user: {
                    name: `${_user.firstName}${_user.lastName ? ' ' + _user.lastName : ''}`,
                    email: _user.email,
                    contactNumber: _user.contactNumber,
                }
            });
        } else {
            throw new Error('User are already registered! Please login.');
        }
    } catch (e) {
        return sendFailureResponse(req, res, e.message.toString());
    }
};

exports.login = async (req, res) => {
    try {
        if (!req.body.contactNumber || !validator.trim(req.body.contactNumber)) {
            throw new Error('Contact Number is required!');
        }
        if (!validator.isMobilePhone(validator.trim(req.body.contactNumber))) {
            throw new Error('Contact Number is not valid!');
        }
        if (!req.body.password || !validator.trim(req.body.password)) {
            throw new Error('Password is required!');
        }
        let user = await UserModel.findOne({contactNumber: validator.trim(req.body.contactNumber)});
        if (!user) {
            throw new Error('You are not registered with us. Please Sign up!');
        } else {
            let authenticated = await user.authenticate(validator.trim(req.body.password));
            if (!authenticated) {
                throw new Error('Wrong Password! Please check and try again!');
            } else {
                let token = signToken(user._id, user.firstName, user.contactNumber, user.email);
                return res.json({
                    success: true,
                    message: 'Logged In!',
                    token: token,
                    user: _.pick(user, 'firstName', 'lastName', 'email', 'contactNumber'),
                });
            }
        }
    } catch (e) {
        return sendFailureResponse(req, res, e.message.toString());
    }
};

exports.changePassword = async (req, res) => {
    try {
        if (!req.body.password || !validator.trim(req.body.password)) {
            throw new Error('Password is required!');
        }
        let hash = await bcrypt.hash(validator.trim(req.body.password), 8);
        let _user = await UserModel.findOneAndUpdate({contactNumber: req.user.contactNumber}, {
            password: hash,
        }, {
            new: true,
            upsert: true,
        });
        if (_user) {
            res.json({success: true, message: 'Password updated!'});
        } else {
            throw new Error('Filed to change password, Please try again!')
        }
    } catch (e) {
        console.log(e.message);
        return sendFailureResponse(req, res, e.message.toString());
    }
};

exports.updateUserData = async (req, res) => {
    try {
        let objectToBeSaved = {};
        if (req.body.email) {
            if (!validator.isEmail(req.body.email)) {
                throw new Error('Email is not valid!');
            } else {
                objectToBeSaved.email = validator.trim(req.body.email);
            }
        }
        if (req.body.firstName && validator.trim(req.body.firstName)) {
            objectToBeSaved.firstName = validator.trim(req.body.firstName);
        }
        if (req.body.lastName && validator.trim(req.body.lastName)) {
            objectToBeSaved.lastName = validator.trim(req.body.lastName);
        }
        let _user = await UserModel.findOneAndUpdate({contactNumber: req.user.contactNumber}, objectToBeSaved, {
            new: true,
            upsert: true,
        });
        if (_user) {
            res.json({
                success: true,
                message: 'User data updated!',
                user: _user
            });
        } else {
            throw new Error('Filed to change user data, Please try again!')
        }
    } catch (e) {
        return sendFailureResponse(req, res, e.message.toString());
    }
};


exports.getUserData = (req, res) => {
    return res.json({
        success: true,
        message: 'User Found!',
        user: req.user,
    });
};
