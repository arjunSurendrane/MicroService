import express from "express";
import { randomBytes } from "crypto";
import axios from "axios";

const app = express();
app.use(express.urlencoded("dev"));
app.use(express.json());

const commentsByPostid = {};

app.get("/posts/:id/comments", (req, res) => {
  const { id } = req.params;
  res.status(200).json({ data: commentsByPostid[id] || [] });
});

app.post("/events", (req, res) => {
  const { type } = req.body;
  console.log(type + "event recieved");
  res.status(200).json({ status: "successs" });
});

app.post("/posts/:id/comments", async (req, res) => {
  const { id: postId } = req.params;
  const { content } = req.body;
  const id = randomBytes(4).toString("hex");
  const comments = commentsByPostid[postId] || [];
  comments.push({ id, content });
  commentsByPostid[postId] = comments;
  await axios.post("http://event-bus-srv:4002/events", {
    type: "commentType",
    data: { id, content, postId },
  });
  res.status(201).json({ status: "successfully comment added" });
});

app.listen(4001, () => console.log("app running on 4001"));
