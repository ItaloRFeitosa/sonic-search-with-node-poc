const express = require("express");

const SonicChannelSearch = require("sonic-channel").Search;
const SonicChannelIngest = require("sonic-channel").Ingest;

const sonicOptions = {
  host: "sonic", // Or '127.0.0.1' if you are still using IPv4
  port: 1491, // Default port is '1491'
  auth: "SecretPassword", // Authentication password (if any)
};

const connected = (type) => () =>
  console.info("Sonic Channel succeeded to connect to host -", type);

const sonicChannelSearch = new SonicChannelSearch(sonicOptions).connect({
  connected: connected("search"),
});

const sonicChannelIngest = new SonicChannelIngest(sonicOptions).connect({
  connected: connected("ingest"),
});

const { Curriculum } = require("./domain/entities");

const CurriculumRepo = require("./infra/database/in-memory/curriculum-repo");

const repo = new CurriculumRepo();

const app = express();

app.use(express.json());

app.get("/health", async (_, res) => {
  await sonicChannelIngest.flushc("curriculum");
  return res.json({ ok: true, version: "0.0.1" });
});

app.post("/curriculum", async (req, res) => {
  const { name, specialties } = req.body;

  const curriculum = new Curriculum(name, specialties);

  repo.insert(curriculum);

  await sonicChannelIngest.push(
    "curriculum",
    "default",
    curriculum.id,
    curriculum.toString()
  );

  return res.json({ message: "created", data: curriculum });
});

app.get("/curriculum/search", async (req, res) => {
  const { q } = req.query;
  const result = await sonicChannelSearch.query("curriculum", "default", q, {
    limit: 10,
  });

  const curriculum = result.map((id) => repo.show(id));

  return res.json(curriculum);
});

app.get("/curriculum/suggest", async (req, res) => {
  const { q } = req.query;
  const result = await sonicChannelSearch.suggest("curriculum", "default", q, {
    limit: 10,
  });
  return res.json(result);
});

app.get("/curriculum", async (req, res) => {
  return res.json({ curriculum: repo.list() });
});

app.listen(3000, () => {
  console.log("Running in port", 3000);
});
