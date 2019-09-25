import mongoose from "mongoose";
import Joi from "joi";

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },
    creatorID: {
        type: String,
        required: true
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
        type: Array
    },
    users: {
        type: Array
    }
});
const Project = mongoose.model("Project", projectSchema);

function validateProject(project) {
    const schema = {
        name: Joi.string()
            .min(3)
            .max(30)
            .required(),
        creatorID: Joi.string().required(),
        description: Joi.string()
    };
    return Joi.validate(project, schema);
}
exports.Project = Project;
exports.validate = validateProject;
