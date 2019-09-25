import mongoose from "mongoose";
import Joi from "joi";

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    taskIndex: {
        type: Number
    },
    project: {
        type: String,
        default: "None"
    },
    description: {
        type: String,
        default: ""
    },
    projectID: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "None"
    },
    performerID: {
        type: String,
        default: "None"
    },
    creatorID: {
        type: String,
        default: "None"
    },
    currentSprint: {
        type: String,
        required: true
    },
    currentStatus: {
        type: String,
        required: true
    },
    dateCreated: {
        type: String,
        default: Date.now()
    },
    dateUpdated: {
        type: String,
        default: Date.now()
    },
    timeConsuming: {
        type: String,
        default: ""
    }
});
const Task = mongoose.model("Task", taskSchema);

function validateTask(task) {
    const schema = {
        name: Joi.string()
            .min(3)
            .max(30)
            .required(),
        taskIndex: Joi.number(),
        project: Joi.string(),
        description: Joi.string(),
        projectID: Joi.string().required(),
        performerID: Joi.string(),
        creatorID: Joi.string(),
        currentSprint: Joi.string().required(),
        currentStatus: Joi.string().required()
    };
    return Joi.validate(task, schema);
}

exports.Task = Task;
exports.validate = validateTask;
