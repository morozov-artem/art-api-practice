import * as supertest from 'supertest';

const request = supertest('https://jsonplaceholder.typicode.com/');

describe('POC tests', () => {
  describe('GET requests', () => {
    it('GET /posts', async () => {
      const res = await request.get('/posts');
  
      expect(res.statusCode).toBe(200);
      expect(res.body[0].id).toBe(1);
  
      //console.log(res);
    });
  
    it('GET /comments with query params', async () => {
      //const res = await request.get('/comments?postId=1');
      const res = await request.get('/comments').query({ postId: 1, limit: 10});
  
      expect(res.body[0].postId).toBe(1);
      //console.log(res);
    });
  });

  describe('POST requests', () => {
    it('POST /posts', async () => {
      const data = {
        "title": "espresso drinks",
        "body": "doppio, mocha, latte",
        "userId": 1
      };
      const res = await request.post('/posts').send(data);
  
      console.log(res);

      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe(data.title);
    });
  });

  describe('PUT requests', () => {
    it('PUT /posts{id}', async () => {
      const getRes = await request.get('/posts/1');
      const beforeTitle = getRes.body.title;
      console.log(beforeTitle);

      const data = {
        "title": "coffee drinks",
        "body": "doppio, mocha, latte, cold brew, iced latte",
        "userId": 1
      };
      const res = await request.put('/posts/1').send(data);
  
      //console.log(res);

      expect(res.statusCode).toBe(200);
      expect(res.body.title).not.toBe(beforeTitle);
      expect(res.body.title).toBe(data.title);
    });
  });

  describe('PATCH requests', () => {
    it('PATCH /posts{id}', async () => {
      const getRes = await request.get('/posts/1');
      const beforeTitle = getRes.body.title;
      console.log(beforeTitle);

      const data = {
        "title": "coffee drinks NEW"
      };
      const res = await request.patch('/posts/1').send(data);
  
      //console.log(res);

      expect(res.statusCode).toBe(200);
      expect(res.body.title).not.toBe(beforeTitle);
      expect(res.body.title).toBe(data.title);
    });
  });

  describe('DELETE requests', () => {
    it('DELETE /posts{id}', async () => {
      const res = await request.delete('/posts/1');
  
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({});
  
      //console.log(res);
    });
  });
});