import mongoose from "mongoose";
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    userID: {
        type: String
    },
    creator: {
        type: String,
        default: ""
    },
    readed: {
        type: Boolean,
        default: false
    },
    message: {
        type: String
    },
    date: {
        type: String,
        default: Date.now()
    },
    type: {
        type: String
    }
});
module.exports = mongoose.model("Message", messageSchema);
