const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

app = express();
app.use(express.json());

let db = null;

const dbPath = path.join(__dirname, "moviesData.db");

let serverToDbConnect = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("App is listening in 3000");
    });
  } catch (e) {
    console.log(e.message);
  }
};
serverToDbConnect();

app.get("/directors/", async (request, response) => {
  const dbQuery = `SELECT *
    FROM director;`;
  const result = await db.all(dbQuery);
  response.send(result);
});

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const dbQuery = `SELECT movie_name FROM movie WHERE director_id = ${directorId};`;
  const result = await db.all(dbQuery);
  response.send(result);
});

app.get("/movies/", async (request, response) => {
  const dbQuery = `SELECT *
    FROM movie;`;
  const result = await db.all(dbQuery);
  response.send(result);
});

app.post("/movies/", async (request, response) => {
  let movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const postQuery = `
  INSERT INTO movie (director_id, movie_name, lead_actor)
  values (
      ${directorId},
      '${movieName}',
      '${leadActor}'
  );`;
  const postResult = db.run(postQuery);
  const id = postResult.lastID;
  response.send(`Movie Successfully Added`);
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getQuery = `SELECT * FROM movie WHERE movie_id = ${movieId};`;

  const getResult = await db.get(getQuery);
  response.send(getResult);
});

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  let movieDetails1 = request.body;
  const { directorId, movieName, leadActor } = movieDetails1;
  const updateQuery = `UPDATE movie
  set 
  director_id = ${directorId},
  movie_name = '${movieName}',
  lead_actor = '${leadActor}' ;`;

  const updateResult = await db.run(updateQuery);
  response.send("Movie Details Updated");
});

app.delete("/movies/:movieId/", (request, response) => {
  const { movieId } = request.params;
  const deleteQuery = `DELETE FROM
  movie WHERE movie_id = ${movieId};`;

  const deleteResult = db.run(deleteQuery);
  response.send("Movie Removed");
});

module.exports = app;
