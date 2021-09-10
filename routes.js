const express = require("express"),
  router = express.Router();

const storage = require("node-persist");

let superheroes = [];

(async function () {
  await Promise.resolve(storage.init());
  persistedHeroes = await storage.getItem("superheroes");
  console.log(`TOTAL SUPERHEROES SAVED: ${persistedHeroes.length}`);
  if (persistedHeroes.length > 0) {
    superheroes = persistedHeroes;
  }
})();

async function persistNotes() {
  await storage.updateItem("superheroes", superheroes);
}

router

  .get("/view", (req, res) => {
    res.render("view", { superheroes });
  })

  //GET ALL SUPERHEROES
  .get("/", (req, res) => {
    res.send(superheroes);
  })

  //GET A SUPERHERO BY KEY
  .get("/:key/", (req, res) => {
    indexOfHero = superheroes.findIndex(
      (superhero) => superhero.key === req.params.key
    );

    if (req.params.key && indexOfHero !== -1) {
      res.send(superheroes[indexOfHero]);
    } else {
      res.send(`"${req.params.key}" could not be found`);
    }
  })

  //ADD NEW SUPERHERO
  .post("/addSuperhero", async (req, res) => {
    indexOfHero = superheroes.findIndex(
      (superhero) => superhero.key === req.body.key
    );

    if (indexOfHero == -1) {
      superheroes.push({
        id: superheroes.length | 0,
        ...req.body,
      });
      console.log(superheroes);
      persistNotes();
      res.send(`New Superhero "${req.body.key}" has been added.`);
    } else if (indexOfHero !== -1) {
      res.send(
        `"${req.body.key}" already exists, create a new Superhero with different key.`
      );
    } else {
      res.send("A required field is missing!");
    }
  })

  //DELETE A SUPERHERO BY KEY
  .get("/:key/deleteSuperhero", async (req, res) => {
    indexOfHero = superheroes.findIndex(
      (superhero) => superhero.key === req.params.key
    );

    if (indexOfHero !== -1) {
      superheroes.splice(indexOfHero, 1);
      persistNotes();
      res.send(`"${req.params.key}" was deleted.`);
    } else {
      res.send(`"${req.params.key}" could not be found`);
    }
  })

  //UPDATE A SUPERHERO BY KEY

  .put("/:key/updateSuperhero", async (req, res) => {
    indexOfHero = superheroes.findIndex(
      (superhero) => superhero.key === req.params.key
    );

    if (
      indexOfHero !== -1 &&
      req.body.key &&
      req.body.name &&
      req.body.powers &&
      req.body.strength
    ) {
      superheroes.splice(indexOfHero, 1, {
        id: superheroes.length | 0,
        ...req.body,
      });
      persistNotes();
      res.send(`"${req.params.key}" was modified.`);
    } else if (
      !req.body.key ||
      !req.body.name ||
      !req.body.powers ||
      !req.body.strength
    ) {
      res.send(`Superhero request is incomplete`);
    } else {
      res.send(`"${req.params.key}" could not be found.`);
    }
  });

module.exports = router;
