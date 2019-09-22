import mongoose from "mongoose";
import Joi from "joi";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        minlength: 3,
        maxlength: 30,
        required: true
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    }
});
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, process.env.SECRET);
    return token;
};
const User = mongoose.model("User", userSchema);

function validateUser(user) {
    const schema = {
        login: Joi.string()
            .min(3)
            .max(30)
            .required(),
        email: Joi.string()
            .min(5)
            .max(50)
            .required()
            .email(),
        password: Joi.string()
            .min(5)
            .max(1024)
            .required()
    };
    return Joi.validate(user, schema);
}
exports.User = User;
exports.validate = validateUser;
