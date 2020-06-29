import { version } from "../../package.json";
import { Router } from "express";
import update from "./update";
import create from "./create";
import search from "./search";
import calculate from "./calculate";
import getbill from "./getbill";
const asyncHandler = require("express-async-handler");

export default pool => {
  let api = Router();

  api.post("/firenoc-calculator/billingslab/_create", (req, res, next) =>
    create(req, res, next)
  );
  api.post("/firenoc-calculator/billingslab/_search", (req, res, next) =>
    search(req, res, pool, next)
  );
  api.post("/firenoc-calculator/billingslab/_update", (req, res, next) =>
    update(req, res, next)
  );
  api.post(
    "/firenoc-calculator/v1/_calculate",
    asyncHandler(
      async (req, res, next) => await calculate(req, res, pool, next)
    )
  );
  api.post(
    "/firenoc-calculator/v1/_getbill",
    asyncHandler(async (req, res, next) => getbill(req, res, next))
  );

  // perhaps expose some API metadata at the root
  api.get("/", (req, res) => {
    res.json({ version });
  });
  return api;
};
