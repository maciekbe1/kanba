import Task from "../models/Task";

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
