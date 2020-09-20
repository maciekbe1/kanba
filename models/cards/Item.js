import mongoose from "mongoose";
import Joi from "joi";

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  cardID: { type: mongoose.Schema.Types.ObjectId, required: true },
  date: { type: Number, default: Date.now() },
  status: { type: Object },
  priority: { type: Object },
  labels: { type: Array, default: [] },
  attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Attachment" }],
  userID: { type: mongoose.Schema.Types.ObjectId, required: true }
});

const Item = mongoose.model("Item", itemSchema);

function validateItem(item) {
  const schema = Joi.object({
    title: Joi.string().max(128, "utf8").required(),
    cardID: Joi.string().required(),
    description: Joi.string().max(5000, "utf8").allow("").optional(),
    status: Joi.object().optional(),
    priority: Joi.object().optional()
  });
  return schema.validate(item);
}
exports.Item = Item;
exports.validate = validateItem;
