import dotenv from "dotenv";

import Koa from "koa";
import Router from "koa-router";
import mongoose from "mongoose";
import bodyParser from "koa-bodyparser";

import api from "./api/index.mjs";
import { jwtMiddleware } from "./lib/token.mjs";

const app = new Koa();
const router = new Router();

dotenv.config();

const port = process.env.PORT || 4000;

app.use(bodyParser());
app.use(jwtMiddleware);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then((response) => {
    console.log("Connected to Mongo DB");
  })
  .catch((e) => {
    console.error(e);
  });

router.use("/api", api.routes());

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
  console.log(`server is listening to port ${port}`);
});
