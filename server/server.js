const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser')
const cors = require('cors');

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const corsOptions = {
    origin: "*",
    credentials: true,
  };
  
app.use(cors(corsOptions));

app.get('/api/movies', async (req, res) => {
  try {
    const moviesWithDetails = await prisma.movie.findMany({
      include: {
        producer: true,
        actors: true,
      }
    });

    const formattedMovies = moviesWithDetails.map(movie => ({
      id: movie.id,
      name: movie.name,
      yearOfRelease: movie.yearOfRelease,
      plot: movie.plot,
      poster: movie.poster,
      producer: movie.producer,
      actors: movie.actors
    }));

    console.log(formattedMovies)
    res.json(formattedMovies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/movies/:id', async (req, res) => {
  const { id } = req.params;
  const { name, releaseDate, plot, producerId, actorIds } = req.body;

  try {
    const existingMovie = await prisma.movie.findUnique({ where: { id: parseInt(id) } });
    if (!existingMovie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    const existingProducer = await prisma.producer.findUnique({ where: { id: producerId } });
    if (!existingProducer) {
      return res.status(400).json({ error: 'Invalid producerId. Please provide a valid producerId.' });
    }

    if (!Array.isArray(actorIds) || actorIds.length === 0) {
      return res.status(400).json({ error: 'Invalid actorIds. Please provide actorIds as a non-empty array.' });
    }

    const updatedMovie = await prisma.movie.update({
      where: { id: parseInt(id) },
      data: {
        name,
        releaseDate,
        plot,
        producerId,
        actors: { 
          set: actorIds.map(actorId => ({ id: actorId }))
        }
      },
    });

    res.json(updatedMovie);
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.post('/api/movies', async (req, res) => {
  const { name, yearOfRelease, plot, poster, producerId, actorIds } = req.body;

  console.log(req.body)
  
  if (!name || !yearOfRelease || !plot || !poster || !producerId || !actorIds) {
    return res.status(400).json({ error: 'Invalid request data. Please provide all required fields.' });
  }

  try {
    const existingProducer = await prisma.producer.findUnique({ where: { id: producerId } });
    if (!existingProducer) {
      return res.status(400).json({ error: 'Invalid producerId. Please provide a valid producerId.' });
    }

    if (!Array.isArray(actorIds) || actorIds.length === 0) {
      return res.status(400).json({ error: 'Invalid actorIds. Please provide actorIds as a non-empty array.' });
    }

    const newMovie = await prisma.movie.create({
      data: {
        name,
        yearOfRelease,
        plot,
        poster,
        producerId,
        actors: { connect: actorIds.map(id => ({ id })) }
      },
    });
    console.log("new", newMovie)
    res.status(201).json(newMovie);
  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.delete('/api/movies/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.movie.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/actors', async (req, res) => {
  try {
    const actors = await prisma.actor.findMany();
    res.json(actors);
  } catch (error) {
    console.error('Error fetching actors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/api/actors', async (req, res) => {
  const { name, gender, dob, bio } = req.body;

  if (!name || !gender || !dob || !bio) {
    return res.status(400).json({ error: 'Invalid request data. Please provide all required fields.' });
  }

  try {
    const newActor = await prisma.actor.create({
      data: {
        name,
        gender,
        dob: new Date(dob), 
        bio
      }
    });

    res.status(201).json(newActor);
  } catch (error) {
    console.error('Error creating actor:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.get('/api/producers', async (req, res) => {
  try {
    const producers = await prisma.producer.findMany();
    res.json(producers);
  } catch (error) {
    console.error('Error fetching producers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/producers', async (req, res) => {
  const { name, gender, dob, bio } = req.body;

  if (!name || !gender || !dob || !bio) {
    return res.status(400).json({ error: 'Invalid request data. Please provide all required fields.' });
  }
  try {
    const newProducer = await prisma.producer.create({
      data: {
        name,
        gender,
        dob: new Date(dob), 
        bio
      }
    });
    res.status(201).json(newProducer);
  } catch (error) {
    console.error('Error creating producer:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
