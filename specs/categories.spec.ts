import { login, postCategory, getCategoryId } from '../utils/helpers'
import config from '../config/base.config';
import controller from '../controller/categories-controller';

describe('categories tests', () => {
  let postCategoryVar;
  let token;
  let categoryId;
  const data = {
    "name":  `Test Category ${Math.floor(Math.random() * 10000)}`
  };

  beforeAll(async () => {
    token = await login(config.email, config.password);
    postCategoryVar = await postCategory(data, token);
    categoryId = await getCategoryId(postCategoryVar);
  });

  afterAll(async () => {
    await controller.deleteCategories(postCategoryVar.body._id);
  });

  describe('Create & Fetch categories', () => {
    it('POST /categories', async () => {
      console.log(postCategoryVar);

      expect(postCategoryVar.statusCode).toBe(200);
      expect(postCategoryVar.body.name).toBe(data.name);
    });

    it('PUT /categories/{id}', async () => {
      console.log(data.name);
      const res = await controller.putCategories(categoryId, { 'name': `${data.name} updated` }).set('Authorization', `Bearer ${token}`);
  
      console.log(res.body);
  
      expect(res.statusCode).toEqual(200);
      expect(res.body.name).not.toBe(data.name);
      expect(res.body.name).toBe(`${data.name} updated`);
    });

    it('DELETE /categories{id}', async () => {
      const res = await controller.deleteCategories(categoryId).set('Authorization', `Bearer ${token}`);
  
      expect(res.statusCode).toBe(200);
    });

    it('Schema Verification - Name is a mandatory field', async () => {
      const data = {
        'name': '',
        'description': 'Test Category Description'
      }
      const res = await controller.postCategories(data);

      expect(res.statusCode).toEqual(422)
      expect(res.body.error).toEqual('Name is required');
    });

    it('Schema Verification - Min char length for name > 1', async () => {
      const data = {
        'name': 'a',
        'description': 'Test Category Description'
      }
      const res = await controller.postCategories(data);

      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toEqual('Brand name is too short');
    });

    it('Schema Verification - Max char length for name is 30', async () => {
      const data = {
        'name': 'a123123123a123123123a1231231231',
        'description': 'Test Category Description'
      }
      const res = await controller.postCategories(data);

      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toEqual('Brand name is too long');
    });

    it('Schema Verification - Description must be a string', async () => {
      const data = {
        'name': 'Description must be a string',
        'description': 111
      }
      const res = await controller.postCategories(data);

      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toEqual('Brand description must be a string');
    });

    it('creation of duplicate brand not allowed', async () => {
      const data = {
        "name":  postCategoryVar.body.name,
        "description": "Test Category Description"
      };
      const res = await controller.postCategories(data);
  
      console.log(res);

      expect(res.statusCode).toBe(422);
      expect(res.body.error).toContain('already exists');
    });

    it('GET /categories', async () => {
      const res = await controller.getCategories();
  
      expect(res.statusCode).toBe(200);

      console.log(res.body.length)
      expect(res.body.length).toBeGreaterThan(1);
      expect(res.body[0]).toHaveProperty('_id');
      expect(res.body[0]).toHaveProperty('name');
      expect(Object.keys(res.body[0])).toEqual(['_id', 'name']);
    });

    it('GET /categories/{id}', async () => {
      const res = await controller.getCategoriesById(postCategoryVar.body._id);
  
      console.log(res.body);
  
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toEqual(postCategoryVar.body.name);
    });

    it('GET /categories/invalid_id should throw an error', async () => {
      const res = await controller.getCategoriesById('1366680a4b1986188d4dce497ba');
    
      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toContain('Unable to fetch brand');
    });

    it('PUT /categories/invalid_id should throw an error', async () => {
      const res = await controller.putCategories('1366680a4b1986188d4dce497ba', {name: 'invalid PUT'});
    
      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toContain('Unable to update categories');
    });

    it('DELETE /categories/invalid_id should throw an error', async () => {
      const res = await controller.deleteCategories('1366680a4b1986188d4dce497ba');
    
      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toContain('Unable to delete brand');
    })
  });

  describe('UPDATE AND DELETE requests', () => {
    it('UPDATE AND DELETE /categories', async () => {
      const getRes = await controller.getCategoriesById(postCategoryVar.body._id);
      const beforeName = getRes.body.name;
      console.log(beforeName);

      const data = {
        "name": "Art Inc - to be deleted"
      };
      const res = await controller.putCategories(postCategoryVar.body._id, data);
  
      expect(res.statusCode).toBe(200);
      expect(res.body.name).not.toBe(beforeName);
      expect(res.body.name).toBe(data.name);

      const resDelete = await controller.deleteCategories(postCategoryVar.body._id);
  
      expect(resDelete.statusCode).toBe(200);
      expect(resDelete.body).toEqual(null);
    });
  });
});
