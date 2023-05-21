const express = require("express"); // importing a CommonJS module
// pre-built morgan middleware
const morgan = require("morgan");
const hubsRouter = require("./hubs/hubs-router.js");

const server = express();

// our first custom middleware :
function customMorgan(req, res, next) {
  console.log(`you made a ${req.method} request`);
  next(); // to pass to the next middleware
}

// custom shortcircuit middleware:
function shortCircuit(req, res, next) {
  res.json("the request was short-circuited!");
}

function addFriend(req, res, next) {
  req.friend = "lady wawa";
  next();
}

server.use(express.json());
// invoke morgan function
server.use(morgan("dev"));
server.use(customMorgan);
//server.use(shortCircuit);
server.use(addFriend);

server.use("/api/hubs", hubsRouter);

server.get("/", (req, res) => {
  res.send(`
    <h2>Hubs API ${req.friend}</h2>
    <p>Welcome to the Hubs API</p>
  `);
});

server.use("*", (req, res) => {
  // catch all 404 errors middleware
  res.status(404).json({ message: `${req.method} ${req.baseUrl} not found!` });
});

module.exports = server;
