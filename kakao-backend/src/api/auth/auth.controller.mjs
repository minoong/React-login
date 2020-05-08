import Joi from "joi";
import Account from "../../models/account.mjs";

export const localRegister = async (ctx) => {
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(4).max(15).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
  });

  console.log(ctx.request.body);

  const result = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    ctx.status = 400;
    return;
  }

  try {
    const existing = await Account.findByEmailOrUsername(ctx.request.body);

    if (existing) {
      ctx.status = 400;
      ctx.body = {
        key: existing.email === ctx.request.body.email ? "email" : "username",
      };
      return;
    }
  } catch (e) {
    ctx.throw(500, e);
  }

  try {
    const account = await Account.localRegister(ctx.request.body);
    const token = await account.generateToken();

    ctx.cookies.set("access_token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    console.log("zzzzzzzzzzzzzzzzzzzzzzz");

    ctx.body = account.profile;
  } catch (e) {
    ctx.throw(500, e);
  }
};

export const localLogin = async (ctx) => {
  const schema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const result = Joi.validate(ctx.request.body, schema);

  if (result.error) {
    ctx.status = 400;
    return;
  }

  const { email, password } = ctx.request.body;

  try {
    const account = await Account.findByEmail(email);

    if (!account || !account.validatePassword(password)) {
      ctx.status = 403;
      return;
    }

    const token = await account.generateToken();

    ctx.cookies.set("access_token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    ctx.body = account.profile;
  } catch (e) {
    ctx.throw(500, e);
  }
};
export const exists = async (ctx) => {
  const { key, value } = ctx.params;

  try {
    const account = await Account.findByEmailOrUsername({ [key]: value });

    ctx.body = {
      exists: account !== null,
    };
  } catch (e) {
    ctx.throw(500, e);
  }
};
export const logout = async (ctx) => {
  ctx.cookies.set("access_token", null, {
    maxAge: 0,
    httpOnly: true,
  });
  ctx.status = 204;
};

export const check = (ctx) => {
  const { user } = ctx.request;

  if (!user) {
    ctx.status = 403;
    return;
  }

  ctx.body = user.profile;
};
