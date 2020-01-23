import mongoose from "mongoose";
import Joi from "joi";

const todoSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  cardID: { type: String, required: true }
});

const Todo = mongoose.model("Todo", todoSchema);

function validateTodo(todo) {
  const schema = {
    userID: Joi.string().required(),
    cardID: Joi.string().required()
  };
  return Joi.validate(todo, schema);
}
exports.Todo = Todo;
exports.validate = validateTodo;
