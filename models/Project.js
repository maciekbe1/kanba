import mongoose from "mongoose";
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    description: {
        type: String
    },
    dateCreated: {
        type: String,
        default: Date.now()
    },
    active: {
        type: Boolean,
        default: true
    },
    admins: {
        type: Array,
        default: []
    },
    users: {
        type: Array,
        default: []
    }
});
module.exports = mongoose.model("Project", projectSchema);
