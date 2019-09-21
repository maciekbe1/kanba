import mongoose from "mongoose";
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    taskID: {
        type: String,
        required: true
    },
    creatorID: {
        type: String,
        required: true
    },
    dateCreated: {
        type: String,
        default: Date.now()
    }
});
module.exports = mongoose.model("Comment", commentSchema);
