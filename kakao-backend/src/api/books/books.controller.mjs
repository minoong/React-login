import mongoose from "mongoose";
import Joi from "joi";
import Book from "../../models/book.mjs";

const {
  Types: { ObjectId },
} = mongoose;

export const get = async (ctx) => {
  const { id } = ctx.params;

  try {
    const book = await Book.findById(id).exec();

    if (!book) {
      ctx.status = 404;
      return;
    }
    ctx.body = book;
  } catch (e) {
    return ctx.throw(500, e);
  }
};

export const list = async (ctx) => {
  try {
    const books = await Book.find().exec();

    ctx.body = books;
  } catch (e) {
    return ctx.throw(500, e);
  }
};

export const create = async (ctx) => {
  const { title, authors, publishedDate, price, tags } = ctx.request.body;

  const book = new Book({
    title,
    authors,
    publishedDate,
    price,
    tags,
  });

  try {
    await book.save();

    ctx.body = book;
  } catch (e) {
    return ctx.throw(500, e);
  }
};

export const remove = async (ctx) => {
  const { id } = ctx.params;

  try {
    await Book.findByIdAndRemove(id).exec();
    ctx.status = 204;
  } catch (e) {
    if (e.name === "CastError") {
      ctx.status = 400;
      return;
    }
  }
};
export const replace = async (ctx) => {
  const { id } = ctx.params;

  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    return;
  }

  const schema = Joi.object().keys({
    title: Joi.string().required(),
    authors: Joi.array().items(
      Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
      })
    ),
    publishedDate: Joi.date().required(),
    price: Joi.number().required(),
    tags: Joi.array().items(Joi.string()).required(),
  });

  const result = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  try {
    const book = await Book.findByIdAndUpdate(id, ctx.request.body, {
      upsert: true,
      new: true,
    });

    ctx.body = book;
  } catch (e) {
    return ctx.throw(500, e);
  }
};
export const update = async (ctx) => {
  const { id } = ctx.params;

  if (!ObjectId.isValid(id)) {
    ctx.status = 400;
    return;
  }

  try {
    const book = await Book.findByIdAndUpdate(id, ctx.request.body, {
      new: true,
    });

    ctx.body = book;
  } catch (e) {
    return ctx.throw(500, e);
  }
};
