const express = require('express');

function createPostRouter(postService) {
  const router = express.Router();

  router.get('/', async (req, res) => {
    res.json(await postService.listPosts());
  });

  router.get('/:id', async (req, res) => {
    res.json(await postService.getPost(req.params.id));
  });

  router.post('/', async (req, res) => {
    const post = await postService.createPost(req.body);
    res.status(201).json(post);
  });

  router.put('/:id', async (req, res) => {
    res.json(await postService.updatePost(req.params.id, req.body));
  });

  router.delete('/:id', async (req, res) => {
    await postService.deletePost(req.params.id);
    res.status(204).end();
  });

  return router;
}

module.exports = { createPostRouter };
