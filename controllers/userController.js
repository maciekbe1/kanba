import bcrypt from "bcrypt";
import User from "../models/User";

exports.getUser = (req, res, next) => {
    const userID = req.params.id;
    User.findById(userID)
        .then(user => {
            if (!user) {
                const error = new Error("Could not find user.");
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({ message: "User fetched.", user: user });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getAllUsers = (req, res, next) => {
    User.find()
        .then(users => {
            res.status(200).json({
                message: "Fetched users successfully.",
                users: users,
                userLength: users.length
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};
