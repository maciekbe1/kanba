import mongoose from "mongoose";
import Joi from "joi";

const todoSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true },
  cards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }]
});

const Todo = mongoose.model("Todo", todoSchema);

function validateTodo(todo) {
  const schema = Joi.object({
    userID: Joi.required(),
    cards: Joi.string().required()
  });
  return schema.validate(todo);
}
exports.Todo = Todo;
exports.validate = validateTodo;
