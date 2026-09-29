import express from "express";

const healthRouter = express.Router();
healthRouter.route("/").get((req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

export default healthRouter;
