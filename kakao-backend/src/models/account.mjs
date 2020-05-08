import mongoose from "mongoose";
import crypto from "crypto";
import { generateToken } from "../lib/token.mjs";

const hash = (password) =>
  crypto
    .createHmac("sha256", process.env.SECRET_KEY)
    .update(password)
    .digest("hex");

const { Schema } = mongoose;

const AccountSchema = new Schema({
  profile: {
    username: String,
    thumbnail: {
      type: String,
      default: "/static/images/default_thumbnail.png",
    },
  },
  email: {
    type: String,
  },
  social: {
    facebook: {
      id: String,
      accessToken: String,
    },
    google: {
      id: String,
      accessToken: String,
    },
  },
  password: String,
  thoughtCount: { type: Number, default: 0 },
  createAt: { type: Date, default: Date.now },
});

AccountSchema.statics.findByUsername = function (username) {
  return this.findOne({ "profile.username": username }).exec();
};
AccountSchema.statics.findByEmail = function (email) {
  return this.findOne({ email }).exec();
};
AccountSchema.statics.findByEmailOrUsername = function ({ email, username }) {
  return this.findOne({
    $or: [{ email }, { "profile.username": username }],
  }).exec();
};
AccountSchema.statics.localRegister = function ({ email, username, password }) {
  const account = new this({
    profile: {
      username,
    },
    email,
    password: hash(password),
  });

  return account.save();
};

AccountSchema.methods.validatePassword = function (password) {
  const hashed = hash(password);
  return this.password === hashed;
};

AccountSchema.methods.generateToken = function () {
  const payload = {
    _id: this._id,
    profile: this.profile,
  };

  return generateToken(payload, "account");
};

const Account = mongoose.model("Account", AccountSchema);
export default Account;
