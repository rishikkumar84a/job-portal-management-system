const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        // Set token from Bearer token in header
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
        return next(new ApiError(401, 'Not authorized to access this route'));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user to req
        req.user = await User.findById(decoded.id);

        next();
    } catch (err) {
        return next(new ApiError(401, 'Not authorized to access this route'));
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user.role.includes(roles)) {
            // Logic fix: authorize checks if req.user.role is in the allowed roles array
            if (!roles.includes(req.user.role)) {
                return next(
                    new ApiError(403, `User role ${req.user.role} is not authorized to access this route`)
                );
            }
        }
        next();
    };
};
