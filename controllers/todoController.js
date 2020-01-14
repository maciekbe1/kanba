import { Todo, validate } from "../models/TodoList";
import { User } from "../models/User";
import mongoose from "mongoose";
import _ from "lodash";
import cuid from "cuid";

exports.createTodoList = async (req, res, next) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const card = req.body.cards;
    const user = req.body.user;
    const list = await Todo.find({ user: user });
    const obj = {
      id: cuid(),
      title: card.title,
      description: card.description,
      list: []
    };
    if (_.isEmpty(list)) {
      let todoList = new Todo({
        user: user,
        cards: [obj]
      });
      todoList = await todoList.save();
      res.status(200).send("Todo and Card was successfully created");
    } else {
      await Todo.find({ user: user }).updateOne({
        $addToSet: { cards: obj }
      });
      res.status(200).send("Card was successfully added to Todo");
    }
  } catch (error) {
    next(error);
  }
};
exports.addTodoItem = async (req, res, next) => {
  try {
    const todoListID = mongoose.Types.ObjectId(req.body.listID);
    const cardID = req.body.cardID;
    const newItem = req.body.item;
    const todoListExist = await Todo.find({ _id: todoListID });

    if (_.isEmpty(todoListExist)) {
      res.status(400).send("Todo list not found");
    } else {
      const todoList = await Todo.findById(todoListID);
      const cardExist = _.isNil(
        _.find(todoList.cards, function(obj) {
          return obj.id === cardID;
        })
      );
      if (cardExist) {
        res.status(400).send("Card list not found");
      } else {
        await todoList.cards.map(cardItem => {
          if (cardItem.id === cardID) {
            cardItem.list.push({
              id: cuid(),
              title: newItem.title,
              content: newItem.content
            });
          }
        });
        const newTodo = new Todo(todoList);
        await newTodo.save();
        return res.status(200).send("Item added successfull");
      }
    }
  } catch (error) {
    next(error);
  }
};

exports.getUserTodoLists = async (req, res, next) => {
  try {
    const userID = mongoose.Types.ObjectId(req.body.userID);
    const user = await User.findOne({ _id: userID });
    if (!user) res.status(400).send("User not found");
    const list = await Todo.findOne({ user: userID }).select("-user");
    res.status(200).send(list);
  } catch (error) {
    next(error);
  }
};
exports.removeTodoList = async (req, res, next) => {
  try {
    const todoListID = mongoose.Types.ObjectId(req.body.listID);
    const todoListExist = await Todo.find({ _id: todoListID });
    if (_.isEmpty(todoListExist)) {
      res.status(400).send("Todo list not exist");
    } else {
      const todoList = await Todo.findById(todoListID);
      const cardID = req.body.cardID;
      const cardExist = _.isNil(
        _.find(todoList.cards, function(obj) {
          return obj.id === cardID;
        })
      );
      if (cardExist) {
        res.status(400).send("Card list not exist");
      } else {
        _.remove(todoList.cards, function(n) {
          return n.id === cardID;
        });
        const removeTodo = new Todo(todoList);
        await removeTodo.save();
        res.status(200).send("card was successfully removed");
      }
    }
  } catch (error) {
    next(error);
  }
};
// exports.todoListUpdate = async (req, res, next) => {

// }
