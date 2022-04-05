const prisma = require("../utils/prisma");

const getMovies = async (req, res) => {
  const filter = {
    runtimeMins: {},
  };

  if (req.query.runtimeGreater) {
    filter.runtimeMins.gt = parseInt(req.query.runtimeGreater);
  }

  if (req.query.runtimeLess) {
    filter.runtimeMins.lt = parseInt(req.query.runtimeLess);
  }

  const movies = await prisma.movie.findMany({
    where: filter,
    include: {
      screenings: true,
    },
  });

  res.json({ movies: movies });
};

const getMovieById = async (req, res) => {
  const getMovie = await prisma.movie.findUnique({
    where: {
      id: parseInt(req.params.id),
    },
  });
  if (!getMovie) {
    res.status(404);
    res.json({ error: "Keep looking chief" });
    return;
  }
  res.json({ movies: getMovie });
};

const createMovie = async (req, res) => {
  const { title, runtime } = req.body;

  const existingMovies = await prisma.movie.findMany({
    where: {
      title: title,
    },
  });
  if (existingMovies.length > 0) {
    res.status(400);
    res.json({ error: "movie exists with title" });
    return;
  }

  const movieData = {
    data: {
      title: title,
      runtimeMins: runtime,
    },
  };
  if (req.body.screenings) {
    const screeningsToCreate = [];

    for (const requestScreening of req.body.screenings) {
      screeningsToCreate.push({
        startsAt: new Date(Date.parse(requestScreening.startsAt)),
        screenId: requestScreening.screenId,
      });
    }
    movieData.data.screenings = {
      create: screeningsToCreate,
    };
  }
  const createdMovie = await prisma.movie.create(movieData);
  res.json({ data: createdMovie });
};

const updateMovie = async (req, res) => {
    
}

module.exports = {
  getMovies,
  createMovie,
  getMovieById,
};
