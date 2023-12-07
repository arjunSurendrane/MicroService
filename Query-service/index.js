import express from "express";
import axios from "axios";

const app = express();
app.use(express.urlencoded("dev"));
app.use(express.json());

const posts = {};

function handlingEvents(type, data) {
  if (type === "commentType") {
    const { postId } = data;
    posts[postId].comments.push(data);
  } else if (type === "postType") {
    const { id } = data;
    posts[id] = { ...data, comments: [] };
  }
}

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  console.log(type + " " + "event recieved");
  handlingEvents(type, data);
  console.log({ posts });
  res.status(200).json({ status: "successs" });
});

app.get("/posts", (req, res) => {
  res.status(200).json({ posts });
});

app.listen(5000, async () => {
  console.log("App running on port 5000...");
  const res = await axios.get("http://event-bus-srv:4002/events");
  for (let event in res.data) {
    const { type, data } = event;
    handlingEvents(type, data);
  }
});
