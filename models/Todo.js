import mongoose from "mongoose";
import Joi from "joi";

const todoSchema = new mongoose.Schema({
  user: { type: String, required: true },
  cards: { type: Array }
});

const Todo = mongoose.model("Todo", todoSchema);

function validateTodo(todo) {
  const schema = Joi.object({
    user: Joi.string().required(),
    cards: Joi.string().required()
  });
  return schema.validate(todo);
}
exports.Todo = Todo;
exports.validate = validateTodo;
