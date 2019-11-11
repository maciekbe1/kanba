import bcrypt from "bcrypt";
import { User, validate } from "../models/User";
import _ from "lodash";
import nodemailer from "nodemailer";

exports.me = async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
};
exports.getUser = (req, res, next) => {
    const userID = req.params.id;
    User.findById(userID)
        .then(user => {
            if (!user) {
                const error = new Error("Could not find user.");
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({ message: "User fetched.", user: user });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.getAllUsers = (req, res, next) => {
    User.find()
        .then(users => {
            res.status(200).json({
                message: "Fetched users successfully.",
                users: users,
                userLength: users.length
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.signUp = async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already exist.");

    user = new User(_.pick(req.body, ["name", "password", "email"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    const token = user.generateAuthToken();
    res.header("x-auth-token", token).send(
        _.pick(user, ["_id", "name", "email"])
    );
    //send a welcome message
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    const mailOptions = {
        from: "Kanba",
        to: req.body.email,
        subject: "Kanba Welcome",
        html: `<p>Welcome in Kanba ${req.body.name}</p>`
    };
    transporter.sendMail(mailOptions, function(err, info) {
        if (err) console.log(err);
        else console.log(info);
    });
};
