import { Todo, validate } from "../models/TodoList";
import { User } from "../models/User";
import mongoose from "mongoose";
import _ from "lodash";
import cuid from "cuid";

exports.createTodoCard = async (req, res, next) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const card = req.body.cards;
    const userID = mongoose.Types.ObjectId(req.body.user);
    const user = await User.findById(userID);
    if (_.isNil(user)) return res.status(400).send("User is not exist");
    if (_.isEmpty(card.title)) return res.status(400).send("Title is required");
    const userHavelist = await Todo.find({ user: userID });
    const obj = {
      id: card.id,
      title: card.title,
      description: card.description,
      expand: false,
      list: []
    };
    if (_.isEmpty(userHavelist)) {
      let todoList = new Todo({
        user: userID,
        cards: [obj]
      });
      todoList = await todoList.save();
      return res.status(200).send("Todo and Card was successfully created");
    } else {
      await Todo.find({ user: user }).updateOne({
        $push: { cards: { $each: [obj], $position: 0 } }
      });
      return res.status(200).send("Card was successfully added to Todo");
    }
  } catch (error) {
    next(error);
  }
};
exports.addTodoItem = async (req, res, next) => {
  try {
    const todoID = mongoose.Types.ObjectId(req.body.todoID);
    const cardID = req.body.cardID;
    const newItem = req.body.item;
    const todoListExist = await Todo.findById(todoID);

    if (_.isEmpty(todoListExist)) {
      return res.status(400).send("Todo list not found");
    } else {
      const cardExist = _.isNil(
        _.find(todoListExist.cards, function(obj) {
          return obj.id === cardID;
        })
      );
      if (cardExist) {
        return res.status(400).send("Card list not found");
      } else {
        await Todo.updateOne(
          { _id: todoID, "cards.id": cardID },
          {
            $push: {
              "cards.$.list": {
                id: cuid(),
                title: newItem.title,
                content: newItem.content
              }
            }
          }
        );
        return res.status(200).send("Item added successfull");
      }
    }
  } catch (error) {
    next(error);
  }
};

exports.getUserTodo = async (req, res, next) => {
  try {
    const userID = mongoose.Types.ObjectId(req.body.userID);
    const user = await User.findOne({ _id: userID });
    if (!user) return res.status(400).send("User not found");
    const list = await Todo.findOne({ user: userID })
      .select("-user")
      .select("-__v");
    return res.status(200).send(list);
  } catch (error) {
    next(error);
  }
};
exports.removeTodoCard = async (req, res, next) => {
  try {
    const todoID = mongoose.Types.ObjectId(req.body.todoID);
    const todoListExist = await Todo.findById(todoID);
    const cardID = req.body.cardID;

    if (_.isEmpty(todoListExist)) {
      return res.status(400).send("Todo list not exist");
    } else {
      const cardExist = _.isNil(
        _.find(todoListExist.cards, function(obj) {
          return obj.id === cardID;
        })
      );
      if (cardExist) {
        return res.status(400).send("Card list not exist");
      } else {
        await Todo.updateOne(
          { _id: todoID },
          { $pull: { cards: { id: cardID } } }
        );
        return res.status(200).send("card was successfully removed");
      }
    }
  } catch (error) {
    next(error);
  }
};
exports.removeTodoItem = async (req, res, next) => {
  try {
    const itemID = req.body.itemID;
    const todoID = req.body.todoID;
    const cardID = req.body.cardID;

    await Todo.updateOne(
      { _id: todoID, "cards.id": cardID },
      {
        $pull: {
          "cards.$.list": {
            id: itemID
          }
        }
      }
    );
    return res.status(200).send("item was successfully removed");
  } catch (error) {
    next(error);
  }
};
exports.updateTodoCard = async (req, res, next) => {
  try {
    const todoID = req.body.todoID;
    const cardID = req.body.cardID;
    const name = Object.keys(req.body.card)[0];
    await Todo.updateOne(
      { _id: todoID, "cards.id": cardID },
      { $set: { [`cards.$.${name}`]: Object.values(req.body.card)[0] } }
    );
    return res.status(200).send("card was successfully updated");
  } catch (error) {
    next(error);
  }
};
