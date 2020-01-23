import mongoose from "mongoose";
import Joi from "joi";

const cardSchema = new mongoose.Schema({
  user: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  expand: { type: Boolean, default: false },
  list: { type: Array, default: [] }
});

const Card = mongoose.model("Card", cardSchema);

function validateCard(card) {
  const schema = {
    user: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string()
      .allow("")
      .optional()
  };
  return Joi.validate(card, schema);
}
exports.Card = Card;
exports.validate = validateCard;
