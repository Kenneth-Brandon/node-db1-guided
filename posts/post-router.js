const express = require('express');

// database access using knex
const db = require('../data/db-config.js');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await db('posts');
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'error retrieving posts', err });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const post = await db.select('*').from('posts').where({ id }).first();
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(400).json({ message: 'Post not found' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'sorry, ran into an error' });
  }
});

router.post('/', async (req, res) => {
  const postData = req.body;

  try {
    const post = await db.insert(postData).into('posts');
    res.status(201).json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'db problem', error: err });
  }
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  db('posts')
    .where({ id })
    .update(changes)
    .then((count) => {
      if (count) {
        res.status(200).json({ updated: count });
      } else {
        res.status(404).json({ message: 'invalid id' });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: 'db problem' });
    });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const count = await db.del().from('posts').where({ id });
    count
      ? res.status(200).json({ deleted: count })
      : res.status(404).json({ message: 'invalid id' });
  } catch (err) {
    res.status(500).json({ message: 'database error', error: err });
  }
});

module.exports = router;
