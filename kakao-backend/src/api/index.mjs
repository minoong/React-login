import Router from "koa-router";
import books from "./books/index.mjs";
import auth from "./auth/index.mjs";

const api = new Router();

api.use("/books", books.routes());
api.use("/auth", auth.routes());

export default api;
