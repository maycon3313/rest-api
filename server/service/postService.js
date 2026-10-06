const { HttpError } = require('../infra/httpError');

function parsePostId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validateTitle(body) {
  if (!body || typeof body.title !== 'string' || body.title.trim().length === 0) {
    throw new HttpError(400, 'O campo title é obrigatório.');
  }

  return body.title.trim();
}

function getPostId(value) {
  const id = parsePostId(value);

  if (id === null) {
    throw new HttpError(400, 'O id deve ser um número inteiro positivo.');
  }

  return id;
}

function createPostService(postRepository) {
  return {
    listPosts() {
      return postRepository.findAll();
    },

    async getPost(value) {
      const post = await postRepository.findById(getPostId(value));

      if (!post) {
        throw new HttpError(404, 'Post não encontrado.');
      }

      return post;
    },

    async createPost(body) {
      return postRepository.create(validateTitle(body));
    },

    async updatePost(value, body) {
      const id = getPostId(value);
      const post = await postRepository.update(id, validateTitle(body));

      if (!post) {
        throw new HttpError(404, 'Post não encontrado.');
      }

      return post;
    },

    async deletePost(value) {
      const post = await postRepository.delete(getPostId(value));

      if (!post) {
        throw new HttpError(404, 'Post não encontrado.');
      }
    }
  };
}

module.exports = { createPostService };
