const express = require('express');
const router = express.Router()

const { getMovies, createMovie, getMovieById, updateMovie } = require('../controllers/movies')

router.get("/", getMovies)

router.post("/", createMovie)

router.get("/:id", getMovieById)

router.patch("/:id", updateMovie)

module.exports = router