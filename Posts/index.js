import express from "express";
import { randomBytes } from "crypto";
import axios from "axios";

const app = express();
app.use(express.urlencoded("dev"));
app.use(express.json());

const posts = {};

app.post("/post", async (req, res) => {
  try {
    const { title } = req.body;
    const id = randomBytes(4).toString("hex");
    console.log(req.body);
    posts[id] = { id, title };
    await axios.post("http://event-bus-srv:4002/events", {
      type: "postType",
      data: { id, title },
    });
    res.status(201).json({ message: "successfully created new post" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

app.post("/events", (req, res) => {
  const { type } = req.body;
  console.log(type + "event recieved");
  res.status(200).json({ status: "successs" });
});

app.get("/posts", (req, res) => {
  res.status(200).json({ data: posts });
});

app.listen(3000, () => {
  console.log("Listening port ..." + 3000);
});
