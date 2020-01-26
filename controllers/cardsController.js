import { Card, validate } from "../models/Card";
import { User } from "../models/User";
import { Todo } from "../models/Todo";
import mongoose from "mongoose";
import _ from "lodash";
import AsyncService from "../services/AsyncService";
exports.createCard = async (req, res, next) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const userID = mongoose.Types.ObjectId(req.body.user);
    let card = new Card({
      user: userID,
      title: req.body.title,
      description: req.body.description
    });
    card = await card.save();
    const cardsArray = await Todo.find({ user: userID });

    if (_.isEmpty(cardsArray)) {
      let todo = new Todo({
        user: userID,
        cards: [card._id.toString()]
      });
      todo = await todo.save();
      return res.status(200).send(card);
    }
    await Todo.updateOne(
      { user: req.body.user },
      { $push: { cards: { $each: [card._id.toString()], $position: 0 } } }
    );
    return res.status(200).send(card);
  } catch (error) {
    next(error);
  }
};
exports.createCardItem = async (req, res, next) => {
  try {
    const cardID = req.body.cardID;
    const newItem = req.body.item;
    const card = await Card.findById(cardID);
    if (_.isNil(card)) {
      return res.status(400).send("Card not found");
    }
    if (_.isEmpty(newItem.title)) {
      return res.status(400).send("title not able to be empty");
    }
    const id = mongoose.Types.ObjectId();
    const success = { message: "Item added successfull", id: id };
    await Card.updateOne(
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
    const todos = await Todo.findOne({ user: req.body.userID });
    let array = [];
    if (todos) {
      await AsyncService.asyncForEach(todos.cards, async card => {
        const item = await Card.findById(mongoose.Types.ObjectId(card));
        if (!_.isNil(item)) array.push(item);
      });
    }
    return res.status(200).send(array);
  } catch (error) {
    next(error);
  }
};
exports.removeCard = async (req, res, next) => {
  try {
    const cardID = req.body.cardID;
    const card = await Card.findById(cardID);
    const userID = req.body.userID;
    if (_.isEmpty(card)) {
      return res.status(400).send("Card not exist");
    } else {
      await Card.deleteOne({ _id: cardID });
      await Todo.updateOne({ user: userID }, { $pull: { cards: cardID } });
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
    await Card.updateOne({ _id: cardID }, { $pull: { list: { _id: itemID } } });
    return res.status(200).send("item was successfully removed");
  } catch (error) {
    next(error);
  }
};
exports.updateCard = async (req, res, next) => {
  try {
    const cardID = req.body.cardID;
    const name = Object.keys(req.body.card)[0];
    const card = req.body.card;
    const type = req.body.type;
    if (_.isNil(type)) {
      await Card.updateOne(
        { _id: cardID },
        { $set: { [name]: Object.values(req.body.card)[0] } }
      );
      return res.status(200).send("card was successfully updated");
    }
    if (type === "all_cards") {
      await Todo.updateOne(
        { user: card.position.userID },
        {
          $pull: { cards: cardID }
        }
      );
      await Todo.updateOne(
        { user: card.position.userID },
        {
          $push: {
            cards: { $each: [cardID], $position: card.position.destination }
          }
        }
      );
      return res.status(200).send("card position updated");
    }
    if (type === "all_lists") {
      const listItem = await Card.findOne(
        {
          _id: mongoose.Types.ObjectId(card.start)
        },
        {
          list: {
            $elemMatch: { _id: mongoose.Types.ObjectId(card.draggableId) }
          }
        }
      );
      await Card.updateOne(
        { _id: card.end },
        {
          $push: {
            list: {
              $each: [listItem.list[0]],
              $position: card.destination
            }
          }
        }
      );
      await Card.updateOne(
        { _id: card.start },
        { $pull: { list: { _id: mongoose.Types.ObjectId(card.draggableId) } } }
      );
      return res.status(200).send("item position updated");
    }
    if (type === "inside_list") {
      const listItem = await Card.findOne(
        {
          _id: mongoose.Types.ObjectId(card.cardID)
        },
        {
          list: {
            $elemMatch: { _id: mongoose.Types.ObjectId(card.itemID) }
          }
        }
      );
      await Card.updateOne(
        { _id: card.cardID },
        { $pull: { list: { _id: mongoose.Types.ObjectId(card.itemID) } } }
      );
      await Card.updateOne(
        { _id: card.cardID },
        {
          $push: {
            list: {
              $each: [listItem.list[0]],
              $position: card.destination
            }
          }
        }
      );
      return res.status(200).send("item position updated");
    }
  } catch (error) {
    next(error);
  }
};
