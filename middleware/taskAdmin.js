import { Task } from "../models/Task";
import jwt from "jsonwebtoken";

module.exports = async (req, res, next) => {
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, process.env.SECRET);
    const verifyCreator = await Task.findOne({
        creatorID: decoded._id
    });
    if (!verifyCreator) return res.status(403).send("Access denied.");
    next();
};
