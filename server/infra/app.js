const express = require('express');
const { createPostRouter } = require('../rout/route/postRoutes');

function createApp(postService) {
  const app = express();

  app.use(express.json());
  app.use('/posts', createPostRouter(postService));

  app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada.' });
  });

  app.use((error, req, res, next) => {
    const status = Number.isInteger(error.status) ? error.status : 500;

    if (status >= 500) {
      console.error(error);
    }

    res.status(status).json({
      error: status < 500 ? error.message : 'Erro interno do servidor.'
    });
  });

  return app;
}

module.exports = { createApp };
