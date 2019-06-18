'use strict';

exports.sendFailureResponse = (req, res, message) => {
    console.log(message);
    return res.json({
        success: false,
        message: message
    })
};
