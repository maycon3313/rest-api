const { createApp } = require('../infra/app');
const { createPostService } = require('../service/postService');

describe('API de posts', () => {
  let repository;
  let server;
  let baseUrl;

  beforeAll(async () => {
    repository = {
      findAll: jest.fn().mockResolvedValue([{ id: 1, title: 'Post inicial' }]),
      findById: jest.fn(async (id) => (
        id === 1 ? { id: 1, title: 'Post inicial' } : null
      )),
      create: jest.fn(async (title) => ({ id: 2, title })),
      update: jest.fn(async (id, title) => (
        id === 1 ? { id, title } : null
      )),
      delete: jest.fn(async (id) => (id === 1 ? { id } : null))
    };

    const app = createApp(createPostService(repository));
    server = await new Promise((resolve) => {
      const listener = app.listen(0, () => resolve(listener));
    });
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  });

  afterAll(async () => {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  test('lista posts como JSON', async () => {
    const response = await fetch(`${baseUrl}/posts`);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual([
      { id: 1, title: 'Post inicial' }
    ]);
  });

  test('cria um post e responde com status 201', async () => {
    const response = await fetch(`${baseUrl}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Novo post' })
    });

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({ id: 2, title: 'Novo post' });
  });

  test('devolve 400 para um id inválido', async () => {
    const response = await fetch(`${baseUrl}/posts/abc`);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'O id deve ser um número inteiro positivo.'
    });
  });

  test('atualiza e exclui um post', async () => {
    const updateResponse = await fetch(`${baseUrl}/posts/1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Post atualizado' })
    });

    expect(updateResponse.status).toBe(200);
    await expect(updateResponse.json()).resolves.toEqual({
      id: 1,
      title: 'Post atualizado'
    });

    const deleteResponse = await fetch(`${baseUrl}/posts/1`, {
      method: 'DELETE'
    });
    expect(deleteResponse.status).toBe(204);
  });

  test('devolve 404 para um post que não existe', async () => {
    const response = await fetch(`${baseUrl}/posts/99`);

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: 'Post não encontrado.'
    });
  });

  test('devolve 404 para rotas desconhecidas', async () => {
    const response = await fetch(`${baseUrl}/nao-existe`);

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: 'Rota não encontrada.'
    });
  });
});
