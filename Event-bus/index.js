import express from "express";
import axios from "axios";

const app = express();
app.use(express.urlencoded("dev"));
app.use(express.json());

const events = [];

app.post("/events", async (req, res) => {
  try {
    const event = req.body;
    events.push(event);
    console.log("event recieved");
    await axios.post("http://posts-srv:3000/events", event);
    await axios.post("http://comments-srv:4001/events", event);
    await axios.post("http://query-service-srv:5000/events", event);
    res.send("success");
  } catch (error) {
    console.log(error);
    res.send(400);
  }
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4002, () => {
  console.log("app running on port == 4002");
});
