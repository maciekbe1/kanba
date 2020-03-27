import bcryptjs from "bcryptjs";
import { User } from "../models/User";
import { OAuth2Client } from "google-auth-library";
import _ from "lodash";
import Joi from "joi";
import nodemailer from "nodemailer";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.signIn = async (req, res, next) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password");
    const validPassword = await bcryptjs.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send("Invalid email or password");

    if (!user.active)
      return res.status(400).send("User is not confirm. Check your email.");

    const token = user.generateAuthToken();
    res.send(token);
  } catch (err) {
    next(err);
  }
};

exports.googleSignIn = async (req, res, next) => {
  try {
    const token_id = req.body.token;
    const googleUser = await verifyAuthToken(token_id);
    const user = await checkIfUserExist(googleUser.email);
    // user ? user : createNewUser(googleUser, res);
    if (user) {
      const token = user.generateAuthToken();
      res.send(token);
    } else {
      const { name, email, picture } = googleUser;
      const random =
        Math.random()
          .toString(36)
          .substring(2, 15) +
        Math.random()
          .toString(36)
          .substring(2, 15);
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(random, salt);
      const user = {
        name,
        email,
        photo: picture,
        password: hashedPassword,
        active: true
      };

      const transporter = nodemailer.createTransport({
        host: "ssl0.ovh.net",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Kanba Welcome",
        html: `Hello,<br> Your new password is.<br>${random}<br>Please change password after login to be more secured.`
      };

      transporter.sendMail(mailOptions, function(err, info) {
        if (err) console.log(err);
        else console.log(info);
      });

      let newUser = new User(user);
      newUser = await newUser.save();
      newUser = await User.findOne({ email });
      const token = newUser.generateAuthToken();
      res.send(token);
    }
  } catch (error) {
    next(error);
  }
};

const verifyAuthToken = async token => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    return ticket.getPayload();
  } catch (error) {
    console.error("Error to verify auth token", error);
  }
};

const checkIfUserExist = async email => await User.findOne({ email }).exec();

function validate(req) {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(50)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(1024)
      .required()
  };
  return Joi.validate(req, schema);
}
