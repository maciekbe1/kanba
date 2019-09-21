import express from "express";
import Project from "../models/Project";

const router = express.Router();

router.get("/:id", async (req, res) => {
    const project = await Project.findById(req.params.id);
    res.send(project);
});
module.exports = router;
