const express = require('express');
const axios = require('axios');
const app = express();
const {OMDB_API_KEY} = process.env
app.use(express.json());

app.post('/', async (req, res) => {
  const payLoad = req.body;
  console.log(`payload`, payLoad);
  const {title, type, year, page, id} = payLoad;
  const url = id
   ?`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${id}` 
   :`https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=${title}&type=${type}&y=${year}&page=${page}`
  console.log(url)
  try {
    const {data} =  await axios.get(url);
    if(data.Error) {
      res.status(400)
      .json(data.Error)
    }
    res.status(200)
    .json(data)
  } catch (error) {
    res.status(error.response.status,)
    .json(error.message)
  }
});

module.exports = app;