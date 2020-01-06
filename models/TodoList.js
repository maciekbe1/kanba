import mongoose from "mongoose";
import Joi from "joi";

const todoSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    title: {
        type: String,
        maxlength: 30,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    },
    list: {
        type: Array,
        default: []
    }
});

const Todo = mongoose.model("Todo", todoSchema);

function validateTodo(todo) {
    const schema = {
        user: Joi.string().required(),
        title: Joi.string()
            .max(30)
            .required(),
        description: Joi.string().required()
    };
    return Joi.validate(todo, schema);
}
exports.Todo = Todo;
exports.validate = validateTodo;
