import { Router } from "express";
import producer from "../../kafka/producer";
import templateInterface from "./templates";

export default ({ config, db }) => {
  let api = Router();
  api.post("/_create", function({ body }, res) {
    let payloads=[];
    try {
      const { ShareMetaData } = body;
      const { shareTemplate, shareContent } = ShareMetaData;
      payloads = templateInterface({shareTemplate, shareContent});
    } catch (e) {
      console.log(e);
    }
    console.log("before",payloads);
    producer.send(payloads, function(err, data) {
      console.log(err);
      console.log(data);
      res.json(data);
    });
  });

  return api;
};
