import { Card, validate } from "../models/Card";
import { User } from "../models/User";
import { Todo } from "../models/Todo";
import mongoose from "mongoose";
import _ from "lodash";
import AsyncService from "../services/AsyncService";
import path from "path";
import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  keyFilename: path.join(__dirname, "../clean-sylph-279310-d91c1dd6077d.json"),
  projectId: "clean-sylph-279310"
});

const bucket = storage.bucket("kanba-cards");
exports.createCard = async (req, res, next) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const userID = mongoose.Types.ObjectId(req.body.user);
    const cardsArray = await Todo.findOne({ user: userID });
    if (cardsArray?.cards?.length >= 100)
      return res.status(405).send("Liczba kart została przekroczona.");
    let card = new Card({
      user: userID,
      title: req.body.title,
      description: req.body.description
    });
    card = await card.save();
    if (_.isNull(cardsArray)) {
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
    const quantity = card.list.length;
    if (_.isNil(card)) {
      return res.status(400).send("Nie znaleziono karty.");
    }
    if (_.isEmpty(newItem.title)) {
      return res.status(405).send("Tytuł nie moze byc pusty.");
    }
    if (quantity > 1000)
      return res.status(405).send("Ilość zadań została przekroczona");
    const id = mongoose.Types.ObjectId();
    const itemSchema = {
      _id: id,
      title: newItem.title,
      content: newItem.content,
      cardID: cardID,
      date: Date.now(),
      status: newItem.status,
      priority: newItem.priority,
      attachments: _.isEmpty(newItem.attachments)
        ? []
        : [...newItem.attachments]
    };
    await Card.updateOne(
      { _id: cardID },
      {
        $push: {
          list: itemSchema
        }
      }
    );
    const success = {
      message: "Zadanie zostało pomyślnie dodane",
      item: itemSchema
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
    const todos = await Todo.findOne({ user: req.body.userID });
    let array = [];
    if (todos) {
      await AsyncService.asyncForEach(todos.cards, async (card) => {
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
      return res.status(400).send("Karta nie istnieje");
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
      if (Object.values(req.body.card)[0].length === 0) {
        return res.status(400).send("Karta musi mieć nazwę");
      }
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
      listItem.list[0].cardID = card.end;
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
      listItem.list[0].cardID = card.cardID;
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

exports.updateItem = async (req, res, next) => {
  try {
    const itemID = mongoose.Types.ObjectId(req.body.itemID);
    const item = req.body.item;
    const name = Object.keys(req.body.item)[0];
    if (
      Object.keys(req.body.item)[0] === "title" &&
      Object.values(req.body.item)[0].length === 0
    ) {
      return res.status(400).send("Zadanie musi mieć nazwę");
    }
    await Card.updateOne(
      {
        list: {
          $elemMatch: { _id: itemID }
        }
      },
      {
        $set: { [`list.$.${name}`]: Object.values(item)[0] }
      }
    );
    return res.status(200).send("zadanie zostało zaktualizowane");
  } catch (error) {
    next(error);
  }
};

exports.updateManyItems = async (req, res, next) => {
  try {
    const destination = req.body.destination;
    const selectedItems = req.body.selectedItems;
    const position = req.body.position;

    let itemArray = [];

    await AsyncService.asyncForEach(
      selectedItems,
      async ({ itemID, cardID }) => {
        const listItem = await Card.findOne(
          {
            _id: mongoose.Types.ObjectId(cardID)
          },
          {
            list: {
              $elemMatch: { _id: mongoose.Types.ObjectId(itemID) }
            }
          }
        );

        listItem.list[0].cardID = destination;
        itemArray.push(listItem.list[0]);
        await Card.updateOne(
          { _id: cardID },
          { $pull: { list: { _id: mongoose.Types.ObjectId(itemID) } } }
        );
      }
    );

    await Card.updateOne(
      { _id: destination },
      {
        $push: {
          list: {
            $each: itemArray,
            $position: position
          }
        }
      }
    );
    return res.status(200).send("zadania zostały zaktualizowane");
  } catch (error) {
    next(error);
  }
};

exports.removeManyItems = async (req, res, next) => {
  try {
    const selected = req.body.selected;
    await AsyncService.asyncForEach(selected, async ({ itemID, cardID }) => {
      await Card.updateOne(
        { _id: cardID },
        { $pull: { list: { _id: mongoose.Types.ObjectId(itemID) } } }
      );
    });
    return res.status(200).send("zadania zostały usunięte");
  } catch (error) {
    next(error);
  }
};

exports.getContent = async (req, res, next) => {
  try {
    const itemID = req.body.itemID;
    const item = await Card.findOne({
      list: {
        $elemMatch: { _id: mongoose.Types.ObjectId(itemID) }
      }
    });
    return res.status(200).send(item);
  } catch (error) {
    next(error);
  }
};

exports.uploadFile = async (req, res, next) => {
  try {
    const file = req.file;
    const itemID = req.body.itemID;
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
    blobStream.on("error", (err) => next(err));
    await Card.updateOne(
      {
        list: {
          $elemMatch: { _id: mongoose.Types.ObjectId(itemID) }
        }
      },
      {
        $push: {
          "list.$.attachments": {
            _id: id,
            fileLocation: publicUrl,
            mimetype: file.mimetype,
            fileName: originalname,
            storageName: blob.name
          }
        }
      }
    );
    blobStream.on("finish", () => {
      res.status(200).send({
        itemID: itemID,
        file: {
          _id: id,
          originalName: originalname,
          storageName: blob.name,
          fileLocation: publicUrl,
          mimetype: file.mimetype
        }
      });
    });
    blobStream.end(file.buffer);
  } catch (error) {
    next(error);
  }
};

exports.removeFile = async (req, res, next) => {
  try {
    const fileName = req.body.fileName;
    const fileID = req.body.fileID;
    const itemID = req.body.itemID;

    await Card.updateOne(
      {
        list: {
          $elemMatch: { _id: mongoose.Types.ObjectId(itemID) }
        }
      },
      {
        $pull: {
          "list.$.attachments": {
            _id: mongoose.Types.ObjectId(fileID)
          }
        }
      }
    );

    await bucket
      .file(fileName)
      .delete()
      .then(() => {
        res.status(200).send({ message: "plik usunięto" });
      })
      .catch((err) => {
        res.status(400).send({ message: err });
      });
  } catch (error) {
    next(error);
  }
};
