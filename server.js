const { createPostRepository } = require('./server/data/postRepository');
const { createApp } = require('./server/infra/app');
const { createDatabase } = require('./server/infra/database');
const { createPostService } = require('./server/service/postService');

const port = Number(process.env.PORT) || 3000;
const { db, close } = createDatabase();
const postRepository = createPostRepository(db);
const postService = createPostService(postRepository);
const app = createApp(postService);
const httpServer = app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => {
    httpServer.close(async (error) => {
      if (error) {
        console.error('Erro ao encerrar o servidor HTTP:', error);
        process.exitCode = 1;
      }

      try {
        await close();
      } catch (closeError) {
        console.error('Erro ao encerrar a conexão com o banco:', closeError);
        process.exitCode = 1;
      }
    });
  });
}
