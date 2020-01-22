import mongoose from "mongoose";
import Joi from "joi";

const todoSchema = new mongoose.Schema({
  user: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  expand: { type: Boolean, default: false },
  list: { type: Array, default: [] }
});

const Todo = mongoose.model("Todo", todoSchema);

function validateTodo(todo) {
  const schema = {
    user: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string()
      .allow("")
      .optional()
  };
  return Joi.validate(todo, schema);
}
exports.Todo = Todo;
exports.validate = validateTodo;
