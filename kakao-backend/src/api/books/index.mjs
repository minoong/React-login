import Router from "koa-router";
import * as bokksCtrl from "./books.controller.mjs";

const books = new Router();

books.get("/:id", bokksCtrl.get);
books.get("/", bokksCtrl.list);
books.post("/", bokksCtrl.create);
books.delete("/:id", bokksCtrl.remove);
books.put("/:id", bokksCtrl.replace);
books.patch("/:id", bokksCtrl.update);

export default books;
