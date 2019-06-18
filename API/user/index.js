'use strict';
const express = require('express');
const router = express.Router();

const {
    login,
    signUp,
    getUserData,
    changePassword,
    isExistingUser,
    updateUserData
} = require('./auth.controller');

const { isAuthenticated } = require('./auth.service');

// @@ create operations via POST
router.post('/user-authentication', isExistingUser);
router.post('/sign-up', signUp);
router.post('/login', login);

// @@ read operation via GET
router.get('/fetch-user', isAuthenticated(), getUserData);

// @@ update operations via PATCH
router.patch('/update-user', isAuthenticated(), updateUserData);
router.patch('/update-password', isAuthenticated(), changePassword);

module.exports = router;
