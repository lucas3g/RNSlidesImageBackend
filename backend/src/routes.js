const routes = require('express').Router();
const multer = require('multer');
const multerConfig = require('./config/multer');

const Post = require('./models/Post');

routes.get('/posts', async (req, res) => {
  const { q: pesquisa } = req.query;

  const posts = pesquisa
      ? await Post.find({"title": `/${pesquisa}/`})
      : await Post.find();

  return res.json(posts);
});

routes.post('/posts', multer(multerConfig).single('file'), async (req, res) => {
  console.log(req.file);
  const { originalname: name, size, key, location: url = '' } = req.file;
  const { title, subt, titledesc, desc } = JSON.parse(req.body.description);

  const post = await Post.create({
    name,
    size,
    key,
    url,
    title,
    subt,
    titledesc,
    desc
  });
  return res.json(post);
});

routes.put('/posts/:id', async (req, res) => {
  const { originalname: name, size, key, location: url = '' } = req.file;
  const { title, subt, titledesc, desc } = req.body;
  const post = await Post.findById(req.params.id);
  await post.updateOne({
    name,
    size,
    key,
    url,
    title,
    subt,
    titledesc,
    desc
  });
  return res.json(post);
});

routes.delete('/posts/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);

  await post.remove();

  return res.send();
});

module.exports = routes;