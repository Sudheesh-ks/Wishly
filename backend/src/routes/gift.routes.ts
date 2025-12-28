import express from "express";
import { giftController } from "../dependencyHandlers/gift.dependencies";

const GiftRouter = express.Router();

GiftRouter.get("/", giftController.getGifts.bind(giftController));
GiftRouter.post("/", giftController.addGift.bind(giftController));
GiftRouter.patch("/:id", giftController.updateGift.bind(giftController));

export default GiftRouter;
