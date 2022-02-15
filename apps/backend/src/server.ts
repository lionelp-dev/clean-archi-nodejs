import { Request, Response } from "express";
const nunjucks = require("nunjucks");
const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

nunjucks.configure(__dirname, {
  autoescape: true,
  express: app,
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", function (req: Request, res: Response) {
  res.render("./views/index.njk");
});

app.get("/*", function (req: Request, res: Response) {
  res.status(404).render("./views/404.njk");
});

app.listen(PORT);
