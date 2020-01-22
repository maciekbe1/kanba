import { Todo, validate } from "../models/TodoList";
import { User } from "../models/User";
import mongoose from "mongoose";
import _ from "lodash";

exports.createCard = async (req, res, next) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const userID = mongoose.Types.ObjectId(req.body.user);
    let todoList = new Todo({
      user: userID,
      title: req.body.title,
      description: req.body.description
    });
    todoList = await todoList.save();
    return res.status(200).send(todoList);
  } catch (error) {
    next(error);
  }
};
exports.createCardItem = async (req, res, next) => {
  try {
    const cardID = req.body.cardID;
    const newItem = req.body.item;
    const card = await Todo.findById(cardID);
    if (_.isNil(card)) {
      return res.status(400).send("Card not found");
    }
    if (_.isEmpty(newItem.title)) {
      return res.status(400).send("title not able to be empty");
    }
    const id = mongoose.Types.ObjectId();
    const success = { message: "Item added successfull", id: id };
    await Todo.updateOne(
      { _id: cardID },
      {
        $push: {
          list: {
            _id: id,
            title: newItem.title,
            content: newItem.content
          }
        }
      }
    );
    return res.status(200).send(success);
  } catch (error) {
    next(error);
  }
};

exports.getUserCards = async (req, res, next) => {
  try {
    const userID = mongoose.Types.ObjectId(req.body.userID);
    const user = await User.findOne({ _id: userID });
    if (!user) return res.status(400).send("User not found");
    const list = await Todo.find({ user: userID })
      .select("-user")
      .select("-__v");
    return res.status(200).send(_.reverse(list));
  } catch (error) {
    next(error);
  }
};
exports.removeCard = async (req, res, next) => {
  try {
    const cardID = req.body.cardID;
    const card = await Todo.findById(cardID);
    if (_.isEmpty(card)) {
      return res.status(400).send("Card not exist");
    } else {
      await Todo.remove({ _id: cardID });
      return res.status(200).send("card was successfully removed");
    }
  } catch (error) {
    next(error);
  }
};
exports.removeCardItem = async (req, res, next) => {
  try {
    const itemID = mongoose.Types.ObjectId(req.body.itemID);
    const cardID = req.body.cardID;
    await Todo.updateOne({ _id: cardID }, { $pull: { list: { _id: itemID } } });
    return res.status(200).send("item was successfully removed");
  } catch (error) {
    next(error);
  }
};
exports.updateCard = async (req, res, next) => {
  try {
    const cardID = req.body.cardID;
    const name = Object.keys(req.body.card)[0];
    await Todo.updateOne(
      { _id: cardID },
      { $set: { [name]: Object.values(req.body.card)[0] } }
    );
    return res.status(200).send("card was successfully updated");
  } catch (error) {
    next(error);
  }
};
