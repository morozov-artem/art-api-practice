import controller from '../controller/brand-controller';

describe('Brands tests', () => {
  let postBrand;
  const data = {
    "name":  `Test Brand ${Math.floor(Math.random() * 10000)}`,
    "description": "Test Brand Description"
  };

  beforeAll(async () => {
    postBrand = await controller.postBrands(data);
  });

  afterAll(async () => {
    await controller.deleteBrands(postBrand.body._id);
  });

  describe('Create & Fetch brands', () => {
    it('POST /brands', async () => {
      //console.log(postBrand);

      expect(postBrand.statusCode).toBe(200);
      expect(postBrand.body).toHaveProperty('createdAt');
      expect(postBrand.body.name).toBe(data.name);
    });

    it('Schema Verification - Name is a mandatory field', async () => {
      const data = {
        'name': '',
        'description': 'Test Brand Description'
      }
      const res = await controller.postBrands(data);

      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toEqual('Name is required');
    });

    it('Schema Verification - Min char length for name > 1', async () => {
      const data = {
        'name': 'a',
        'description': 'Test Brand Description'
      }
      const res = await controller.postBrands(data);

      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toEqual('Brand name is too short');
    });

    it('Schema Verification - Max char length for name is 30', async () => {
      const data = {
        'name': 'a123123123a123123123a1231231231',
        'description': 'Test Brand Description'
      }
      const res = await controller.postBrands(data);

      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toEqual('Brand name is too long');
    });

    it('Schema Verification - Description must be a string', async () => {
      const data = {
        'name': 'Description must be a string',
        'description': 111
      }
      const res = await controller.postBrands(data);

      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toEqual('Brand description must be a string');
    });

    it('creation of duplicate brand not allowed', async () => {
      const data = {
        "name":  postBrand.body.name,
        "description": "Test Brand Description"
      };
      const res = await controller.postBrands(data);
  
      console.log(res);

      expect(res.statusCode).toBe(422);
      expect(res.body.error).toContain('already exists');
    });

/*
    it('GET /brands', async () => {
      const res = await request.get('/brands');
  
      expect(res.statusCode).toBe(200);

      console.log(res.body.length)
      expect(res.body.length).toBeGreaterThan(1);
      expect(res.body[0]).toHaveProperty('_id');
      expect(res.body[0]).toHaveProperty('name');
      expect(Object.keys(res.body[0])).toEqual(['_id', 'name']);
      expect(res.body[0]._id).toBe(newBrand._id);
  
      //console.log(res);
    });*/

    it('GET /brands/{id}', async () => {
      const res = await controller.getBrandsById(postBrand.body._id);
  
      console.log(res.body);
  
      expect(res.statusCode).toBe(200);
      expect(res.body.name).toEqual(postBrand.body.name);
    });

    it('GET /brands/invalid_id should throw an error', async () => {
      const res = await controller.getBrandsById('1366680a4b1986188d4dce497ba');
  
      //console.log(res.body);
  
      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toContain('Unable to fetch brand');
    });

    it('PUT /brands/invalid_id should throw an error', async () => {
      const res = await controller.putBrands('1366680a4b1986188d4dce497ba', {name: 'invalid PUT'});
  
      //console.log(res.body);
  
      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toContain('Unable to update brands');
    });

    it('DELETE /brands/invalid_id should throw an error', async () => {
      const res = await controller.deleteBrands('1366680a4b1986188d4dce497ba');
  
      //console.log(res.body);
  
      expect(res.statusCode).toEqual(422);
      expect(res.body.error).toContain('Unable to delete brand');
    });
  });

  describe('UPDATE AND DELETE requests', () => {
    it('UPDATE AND DELETE /brands', async () => {
      const getRes = await controller.getBrandsById(postBrand.body._id);
      const beforeName = getRes.body.name;
      console.log(beforeName);

      const data = {
        "name": "Art Inc - to be deleted"
      };
      const res = await controller.putBrands(postBrand.body._id, data);
  
      //console.log(res);

      expect(res.statusCode).toBe(200);
      expect(res.body.name).not.toBe(beforeName);
      expect(res.body.name).toBe(data.name);


      const resDelete = await controller.deleteBrands(postBrand.body._id);
  
      expect(resDelete.statusCode).toBe(200);
      expect(resDelete.body).toEqual(null);
    });
  });
});