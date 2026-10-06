const { createPostService } = require('../service/postService');

describe('postService', () => {
  let repository;
  let service;

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };
    service = createPostService(repository);
  });

  test('lista os posts do repositório', async () => {
    const posts = [{ id: 1, title: 'Primeiro post' }];
    repository.findAll.mockResolvedValue(posts);

    await expect(service.listPosts()).resolves.toEqual(posts);
  });

  test('valida o id antes de consultar um post', async () => {
    await expect(service.getPost('abc')).rejects.toMatchObject({
      status: 400,
      message: 'O id deve ser um número inteiro positivo.'
    });
    expect(repository.findById).not.toHaveBeenCalled();
  });

  test('retorna 404 quando o post não existe', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.getPost('42')).rejects.toMatchObject({
      status: 404,
      message: 'Post não encontrado.'
    });
  });

  test('remove espaços extras do título ao criar um post', async () => {
    const post = { id: 1, title: 'Novo post' };
    repository.create.mockResolvedValue(post);

    await expect(service.createPost({ title: '  Novo post  ' })).resolves.toEqual(post);
    expect(repository.create).toHaveBeenCalledWith('Novo post');
  });

  test('rejeita um título vazio sem consultar o repositório', async () => {
    await expect(service.createPost({ title: '   ' })).rejects.toMatchObject({
      status: 400,
      message: 'O campo title é obrigatório.'
    });
    expect(repository.create).not.toHaveBeenCalled();
  });

  test('atualiza um post existente', async () => {
    const post = { id: 7, title: 'Título atualizado' };
    repository.update.mockResolvedValue(post);

    await expect(service.updatePost('7', { title: 'Título atualizado' })).resolves.toEqual(post);
    expect(repository.update).toHaveBeenCalledWith(7, 'Título atualizado');
  });

  test('exclui um post existente', async () => {
    repository.delete.mockResolvedValue({ id: 3 });

    await expect(service.deletePost('3')).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith(3);
  });

  test('retorna 404 quando tenta excluir um post inexistente', async () => {
    repository.delete.mockResolvedValue(null);

    await expect(service.deletePost('3')).rejects.toMatchObject({
      status: 404,
      message: 'Post não encontrado.'
    });
  });
});
