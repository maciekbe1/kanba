import bcrypt from "bcrypt";
import crypto from "crypto";
import { User, validate } from "../models/User";
import _ from "lodash";
import nodemailer from "nodemailer";

exports.me = async (req, res) => {
    const user = await User.findById(req.user._id)
        .select("-password")
        .select("-active");
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
    const random = crypto.randomBytes(20).toString("hex");
    user.password = await bcrypt.hash(user.password, salt);
    user.accountConfirmation = random;

    await user.save();
    const token = user.generateAuthToken();
    res.header("x-auth-token", token).send(
        _.pick(user, ["_id", "name", "email"])
    );
    //send a confirm message
    let transporter = nodemailer.createTransport({
        host: "poczta.o2.pl",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: req.body.email,
        subject: "Kanba Welcome",
        html: `Hello,<br> Please Click on the link to verify your email.<br><a href="${process.env.FRONT_URL}/verify/${random}">Click here to verify</a>`
    };
    transporter.sendMail(mailOptions, function(err, info) {
        if (err) console.log(err);
        else console.log(info);
    });
};

exports.verify = async (req, res) => {
    const hash = req.params.hash;
    const user = await User.findOne({ accountConfirmation: hash });
    if (!user) {
        return res.status(400).send({
            type: "bad-link",
            message: "We were unable to find a user for this link."
        });
    }
    if (user.active)
        return res.status(400).send({
            type: "already-verified",
            message: "This user has already been verified."
        });

    user.active = true;
    user.accountConfirmation = "";
    await user.save();
    return res.status(201).json({
        message: "User confirmation successfully."
    });
};
exports.resetPassword = async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("User is not exist.");
    if (!user.active) return res.status(400).send("User is not active.");
    const random = crypto.randomBytes(20).toString("hex");
    user.emailConfirmation = random;
    await user.save();

    let transporter = nodemailer.createTransport({
        host: "poczta.o2.pl",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: req.body.email,
        subject: "Kanba - reset password request",
        html: `Hello,<br> Please Click on the link to set a new password to your account.<br><a href="${process.env.FRONT_URL}/set-password/${random}">Set new password</a>`
    };
    transporter.sendMail(mailOptions, function(err, info) {
        if (err) console.log(err);
        else console.log(info);
    });
    return res.status(201).json({
        message: "Email was sended"
    });
};
exports.setPassword = async (req, res) => {
    const hash = req.body.hash;
    const password = req.body.password;
    const user = await User.findOne({ emailConfirmation: hash });
    if (!user)
        return res
            .status(400)
            .send("We were unable to find a user for this link.");
    if (password.length < 5)
        return res
            .status(400)
            .send("Password length must equal 5 character or be longer.");

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.emailConfirmation = "";
    await user.save();
    return res.status(200).json({
        message: "Password was changed successfuly"
    });
};
