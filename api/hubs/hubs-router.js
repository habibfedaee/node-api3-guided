const express = require("express");

const Hubs = require("./hubs-model.js");
const Messages = require("../messages/messages-model.js");

const router = express.Router();

router.get("/", (req, res, next) => {
  Hubs.find(req.query)
    .then((hubs) => {
      // to check error handling middle working:
      // through an error
      throw new Error("OMG! what happend!"); // after testing remove it.
      res.status(200).json(hubs);
    })
    .catch((error) => {
      next(error); // or simply pass next object inside the catch
    });
});

router.get("/:id", (req, res, next) => {
  Hubs.findById(req.params.id)
    .then((hub) => {
      if (hub) {
        res.status(200).json(hub);
      } else {
        res.status(404).json({ message: "Hub not found" });
      }
    })
    .catch(next);
});

router.post("/", (req, res, next) => {
  Hubs.add(req.body)
    .then((hub) => {
      res.status(201).json(hub);
    })
    .catch(next);
});

router.delete("/:id", (req, res, next) => {
  Hubs.remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({ message: "The hub has been nuked" });
      } else {
        res.status(404).json({ message: "The hub could not be found" });
      }
    })
    .catch(next);
});

router.put("/:id", (req, res, next) => {
  Hubs.update(req.params.id, req.body)
    .then((hub) => {
      if (hub) {
        res.status(200).json(hub);
      } else {
        res.status(404).json({ message: "The hub could not be found" });
      }
    })
    .catch(next);
});

router.get("/:id/messages", (req, res, next) => {
  Hubs.findHubMessages(req.params.id)
    .then((messages) => {
      res.status(200).json(messages);
    })
    .catch(next);
});

router.post("/:id/messages", (req, res, next) => {
  const messageInfo = { ...req.body, hub_id: req.params.id };

  Messages.add(messageInfo)
    .then((message) => {
      res.status(210).json(message);
    })
    .catch(next);
});

// error handling middleware goes here at the end:
router.use((req, rest, next) => {
  res.status(error.status || 500).json({
    message: error.message,
    customMessage: "something bad happened in hubs-router",
  });
});

module.exports = router;
