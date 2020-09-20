import mongoose from "mongoose";
import Joi from "joi";
import { ObjectId } from "mongodb";

const attachmentSchema = new mongoose.Schema({
  itemID: { type: ObjectId, required: true },
  cardID: { type: ObjectId, required: true },
  date: { type: Number, default: Date.now() },
  content: { type: String },
  type: { type: String },
  name: { type: String },
  storageName: { type: String },
  size: { type: Number }
});

const Attachment = mongoose.model("Attachment", attachmentSchema);

function validateAttachment(attachment) {
  const schema = Joi.object({
    itemID: Joi.required(),
    cardID: Joi.required()
  });
  return schema.validate(attachment);
}
exports.Attachment = Attachment;
exports.validate = validateAttachment;
