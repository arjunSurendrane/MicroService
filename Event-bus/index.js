import express from "express";
import axios from "axios";

const app = express();
app.use(express.urlencoded("dev"));
app.use(express.json());

const events = [];

app.post("/events", (req, res) => {
  const event = req.body;
  events.push(event);
  axios.post("http://localhost:4000/events", event);
  axios.post("http://localhost:4001/events", event);
  axios.post("http://localhost:4003/events", event);
  res.send("success");
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4002, () => {
  console.log("app running on port 4002");
});
