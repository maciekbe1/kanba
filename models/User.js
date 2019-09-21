import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    login: {
        type: String,
        minlength: 3,
        maxlength: 30,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    f_name: {
        type: String,
        // required: true
        default: ""
    },
    l_name: {
        type: String,
        default: ""
        // required: true
    }
});

module.exports = mongoose.model("User", userSchema);

// export function validateUser(user) {
//     const schema = {
//         login: Joi.string().required(),
//         password: Joi.string().required()
//     };
//     return Joi.validate(user, schema);
// }
