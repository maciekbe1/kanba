import bcryptjs from "bcryptjs";
import { User } from "../models/User";
import _ from "lodash";
import Joi from "joi";

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
