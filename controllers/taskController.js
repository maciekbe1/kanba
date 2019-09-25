import { Task, validate } from "../models/Task";
import { User } from "module";
exports.getTask = (req, res, next) => {
    const taskID = req.params.id;
    Task.findById(taskID)
        .then(task => {
            if (!task) {
                const error = new Error("Could not find task.");
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({ message: "Task fetched.", task: task });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getAllTasks = (req, res, next) => {
    const userID = req.params.userID;
    const search = req.params.search;
    if (search) {
        Task.find({
            performerID: userID,
            name: { $regex: search, $options: "i" }
        })
            .then(filteredTask => {
                res.status(200).json({
                    message: "Fetched tasks successfully.",
                    tasks: filteredTask,
                    taskCount: filteredTask.length
                });
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
    } else {
        Task.find({
            performerID: userID
        })
            .then(task => {
                if (!task) {
                    res.status(200).json({ message: "No tasks exist" });
                }
                res.status(200).json({
                    message: "Fetched tasks successfully.",
                    tasks: task,
                    taskCount: task.length
                });
            })
            .catch(err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            });
    }
};

exports.createTask = async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const tasks = await Task.find({
        projectID: req.body.projectID
    });
    const taskIndex = tasks.length;
    let task = new Task({
        projectID: req.body.projectID,
        taskIndex: taskIndex,
        name: req.body.name,
        description: req.body.description,
        performerID: req.body.performerID,
        creatorID: req.body.creatorID,
        currentSprint: req.body.currentSprint,
        currentStatus: req.body.currentStatus
    });
    // const checkUserInProject = await User.find({
    //     _id: req.body.performerID,
    //     users: req.body.performerID
    // });

    // if (checkUserInProject)
    //     return res.status(400).send("User does not exist in this project!");
    task = await task.save();
    res.send(task);
};
