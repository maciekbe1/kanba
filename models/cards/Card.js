import mongoose from "mongoose";
import Joi from "joi";

const cardSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  description: { type: String },
  expand: { type: Boolean, default: true },
  list: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
  date: { type: String, default: Date.now() }
});

const Card = mongoose.model("Card", cardSchema);

function validateCard(card) {
  const schema = Joi.object({
    userID: Joi.required(),
    title: Joi.string().max(128, "utf8"),
    description: Joi.string().max(5000, "utf8").allow("").optional()
  });
  return schema.validate(card);
}
exports.Card = Card;
exports.validate = validateCard;
