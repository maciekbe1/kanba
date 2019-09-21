import mongoose from "mongoose";
const Schema = mongoose.Schema;

const statusSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    projectID: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model("Status", statusSchema);
