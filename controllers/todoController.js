import { Todo, validate } from "../models/TodoList";
import { User } from "../models/User";
import mongoose from "mongoose";

exports.createTodoList = async (req, res, next) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        let todoList = new Todo({
            user: req.body.user,
            title: req.body.title,
            description: req.body.description
        });

        todoList = await todoList.save();
        res.send(todoList);
    } catch (error) {
        next(error);
    }
};
exports.addTodoItem = async (req, res, next) => {
    try {
        const todoListId = req.body.id;
        const item = req.body.item;
        if (todoListId) {
            await Todo.findById(todoListId).updateOne({
                $push: { list: item }
            });
            return res.status(200).send("Item added successfull");
        }
        return res.status(400).send("Todo list not found");
    } catch (error) {
        next(error);
    }
};

exports.getUserTodoLists = async (req, res, next) => {
    try {
        const userID = mongoose.Types.ObjectId(req.body.userID);
        const user = await User.findOne({ _id: userID });
        if (!user) res.status(400).send("User not found");
        const lists = await Todo.find({ user: userID }).select("-user");
        res.status(200).send(lists);
    } catch (error) {
        next(error);
    }
};
exports.removeTodoList = async (req, res, next) => {
    try {
        const todoList = await Todo.findByIdAndRemove(req.body.listID);
        if (!todoList) return res.status(400).send("Todo list not exist");
        res.send(todoList);
    } catch (error) {
        next(error);
    }
};
// exports.todoListUpdate = async (req, res, next) => {

// }
