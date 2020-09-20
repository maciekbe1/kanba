import { Card, validate } from "../models/cards/Card";
import { User } from "../models/User";
import { Todo } from "../models/cards/Todo";
import { Item } from "../models/cards/Item";
import { Attachment } from "../models/Attachment";

import mongoose from "mongoose";
import _ from "lodash";
import AsyncService from "../services/AsyncService";
import path from "path";
import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  keyFilename: path.join(__dirname, `../google-credentials.json`),
  projectId: "clean-sylph-279310"
});

const bucket = storage.bucket("kanba-cards");

exports.createCard = async (req, res, next) => {
  try {
    // const { error } = validate(req.body);
    // if (error) return res.status(400).send(error.details[0].message);
    const userID = mongoose.Types.ObjectId(req.body.user);
    const cardsArray = await Todo.findOne({ userID: userID });
    if (cardsArray?.cards?.length >= 100)
      return res.status(405).send("card quantity exceeded");
    let card = new Card({
      userID,
      title: req.body.title,
      description: req.body.description
    });
    card = await card.save();
    if (_.isNull(cardsArray)) {
      let todo = new Todo({
        userID,
        cards: [card._id]
      });
      todo = await todo.save();
      return res.status(200).send(card);
    }
    await Todo.updateOne(
      { userID },
      { $push: { cards: { $each: [card._id], $position: 0 } } }
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
    const quantity = card.list.length;

    if (_.isNil(card)) {
      return res.status(400).send("Card not found");
    }
    if (_.isEmpty(newItem.title)) {
      return res.status(405).send("Title can't be empty");
    }
    if (quantity > 1000) return res.status(405).send("Item quantity exceeded");

    let item = new Item({
      title: newItem.title,
      description: newItem.description,
      cardID: mongoose.Types.ObjectId(cardID),
      status: newItem.status,
      priority: newItem.priority,
      labels: [],
      attachments: [],
      userID: card.userID
    });
    item = await item.save();

    await Card.updateOne(
      { _id: cardID },
      {
        $push: {
          list: item._id
        }
      }
    );
    const success = {
      message: "Item was successfuly added",
      item
    };
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
    const todos = await Todo.findOne({ userID: userID });
    let cards = [];
    if (todos) {
      await AsyncService.asyncForEach(todos.cards, async (cardID) => {
        let card = await Card.findById(mongoose.Types.ObjectId(cardID));
        if (!_.isNil(card)) {
          let itemPopulated = await Card.findById(cardID)
            .populate({
              path: "list",
              model: Item,
              populate: {
                path: "attachments",
                model: Attachment
              }
            })
            .then((result) => {
              return result;
            })
            .catch((err) => {
              console.log(err);
            });
          cards.push(itemPopulated);
        }
      });
    }
    return res.status(200).send(cards);
  } catch (error) {
    next(error);
  }
};

exports.removeCard = async (req, res, next) => {
  try {
    const cardID = mongoose.Types.ObjectId(req.body.cardID);
    const card = await Card.findById(cardID);
    const userID = mongoose.Types.ObjectId(req.body.userID);
    if (_.isEmpty(card)) {
      return res.status(400).send("Card doesn't exist");
    } else {
      const attachments = await Attachment.find({ cardID });
      attachments.forEach(async (file) => {
        await bucket.file(file.storageName).delete();
      });
      await Card.deleteOne({ _id: cardID });
      await Item.deleteMany({ cardID });
      await Attachment.deleteMany({ cardID });
      await Todo.updateOne({ userID: userID }, { $pull: { cards: cardID } });
      return res.status(200).send("Card was successfully removed");
    }
  } catch (error) {
    next(error);
  }
};

exports.removeCardItem = async (req, res) => {
  // const itemID = mongoose.Types.ObjectId(req.body.itemID);
  // const cardID = req.body.cardID;
  // await Card.updateOne({ _id: cardID }, { $pull: { list: { _id: itemID } } });
  // return res.status(200).send("item was successfully removed");
  return res.status(200).send("Deprecated item removing.");
};

exports.updateCardProperties = async (req, res, next) => {
  try {
    const cardID = req.body.cardID;
    const name = req.body.name;
    const property = req.body.property;
    await Card.updateOne({ _id: cardID }, { $set: { [name]: property } });
    return res.status(200).send("card was successfully updated");
  } catch (error) {
    next(error);
  }
};

exports.updateCardPosition = async (req, res, next) => {
  try {
    const card = req.body.card;
    const type = req.body.type;

    function cardProperyValidator() {
      if (_.isNil(type)) {
        return res.status(401).send("Operation Type is required.");
      }
      for (let [key, value] of Object.entries(card)) {
        if (_.isNil(value)) {
          return {
            result: true,
            message: `Error: { Key: ${key} value: ${value} }`
          };
        }
        return { result: false, message: null };
      }
    }

    if (cardProperyValidator().result) {
      return res.status(401).send(cardProperyValidator().message);
    }

    if (type === "card_change_position") {
      await Todo.updateOne(
        { userID: card.userID },
        {
          $pull: { cards: mongoose.Types.ObjectId(card.cardID) }
        }
      );
      await Todo.updateOne(
        { userID: card.userID },
        {
          $push: {
            cards: {
              $each: [mongoose.Types.ObjectId(card.cardID)],
              $position: card.destination
            }
          }
        }
      );
      return res.status(200).send("Card position updated");
    }
    if (type === "item_change_card") {
      await Item.updateOne({ _id: card.itemID }, { cardID: card.newCardID });
      await Card.updateOne(
        { _id: card.oldCardID },
        { $pull: { list: mongoose.Types.ObjectId(card.itemID) } }
      );
      await Card.updateOne(
        { _id: card.newCardID },
        {
          $push: {
            list: {
              $each: [mongoose.Types.ObjectId(card.itemID)],
              $position: card.position
            }
          }
        }
      );
      return res.status(200).send("Item position updated");
    }
    if (type === "inside_list") {
      await Card.updateOne(
        { _id: mongoose.Types.ObjectId(card.cardID) },
        {
          $pull: { list: card.itemID }
        }
      );
      await Card.updateOne(
        { _id: mongoose.Types.ObjectId(card.cardID) },
        {
          $push: {
            list: {
              $each: [mongoose.Types.ObjectId(card.itemID)],
              $position: card.destination
            }
          }
        }
      );
      return res.status(200).send("Item position updated");
    }
  } catch (error) {
    next(error);
  }
};

exports.updateItemProperties = async (req, res, next) => {
  try {
    const itemID = mongoose.Types.ObjectId(req.body.itemID);
    const property = req.body.property;
    const name = req.body.name;

    if (name === "title" && property.length === 0) {
      return res.status(400).send("Item must have name");
    }
    await Item.updateOne(
      {
        _id: itemID
      },
      {
        $set: { [name]: property }
      }
    );
    return res.status(200).send("Item was updated");
  } catch (error) {
    next(error);
  }
};

exports.updateManyItems = async (req, res, next) => {
  try {
    const destination = req.body.destination;
    const selectedItems = req.body.selectedItems;
    const position = req.body.position;

    await AsyncService.asyncForEach(
      selectedItems,
      async ({ itemID, cardID }) => {
        await Item.updateOne(
          {
            _id: mongoose.Types.ObjectId(itemID)
          },
          { cardID: mongoose.Types.ObjectId(destination) }
        );
        await Card.updateOne(
          { _id: cardID },
          { $pull: { list: mongoose.Types.ObjectId(itemID) } }
        );
      }
    );

    await Card.updateOne(
      { _id: destination },
      {
        $push: {
          list: {
            $each: selectedItems.map((item) => item.itemID),
            $position: position
          }
        }
      }
    );
    return res.status(200).send("Items was updated");
  } catch (error) {
    next(error);
  }
};

exports.removeManyItems = async (req, res, next) => {
  try {
    const selected = req.body.selected;
    await AsyncService.asyncForEach(selected, async (itemID) => {
      const items = await Attachment.find({ itemID });
      if (!_.isEmpty(items)) {
        items.forEach(async (file) => {
          await bucket.file(file.storageName).delete();
        });
      }
    });

    await Item.deleteMany({ _id: { $in: selected } });
    await Attachment.deleteMany({ itemID: { $in: selected } });
    return res.status(200).send("Items was deleted");
  } catch (error) {
    next(error);
  }
};

exports.uploadFile = async (req, res, next) => {
  try {
    const file = req.file;
    const itemID = req.body.itemID;
    const userID = req.body.userID;
    const cardID = req.body.cardID;
    const id = mongoose.Types.ObjectId();
    const ext = path.extname(file.originalname);

    if (!file || Object.keys(file).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    const originalname = file.originalname;
    file.originalname = id.toString() + ext;

    const blob = bucket.file(file.originalname);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

    let attachment = new Attachment({
      _id: id,
      itemID: itemID,
      userID: userID,
      cardID: cardID,
      content: publicUrl,
      type: file.mimetype,
      name: originalname,
      storageName: blob.name,
      size: file.size
    });
    attachment = await attachment.save();

    await Item.updateOne(
      { _id: mongoose.Types.ObjectId(itemID) },
      {
        $push: {
          attachments: mongoose.Types.ObjectId(attachment._id)
        }
      }
    );

    blobStream.on("error", (err) => next(err));
    blobStream.on("finish", () => {
      res.status(200).send(attachment);
    });
    blobStream.end(file.buffer);
  } catch (error) {
    next(error);
  }
};

exports.removeFile = async (req, res, next) => {
  try {
    const name = req.body.name;
    const fileID = req.body.fileID;
    const itemID = req.body.itemID;
    await Attachment.deleteOne({ _id: fileID });
    await Item.updateOne(
      { _id: mongoose.Types.ObjectId(itemID) },
      {
        $pull: {
          attachments: mongoose.Types.ObjectId(fileID)
        }
      }
    );

    await bucket
      .file(name)
      .delete()
      .then(() => {
        res.status(200).send({ message: "File was deleted" });
      })
      .catch((err) => {
        res.status(400).send({ message: err });
      });
  } catch (error) {
    next(error);
  }
};
