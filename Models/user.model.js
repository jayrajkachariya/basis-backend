'use strict';
const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    password: { type: String, required: true },
}, {
    timestamps: true,
});

UserSchema.methods = {
    async authenticate(password) {
        return await bcrypt.compare(password, this.password)
    },
};

module.exports = model('UserModel', UserSchema);
