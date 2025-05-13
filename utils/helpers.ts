import adminController from '../controller/admin-controller';
import catergoriesController from '../controller/categories-controller';

/**
 * login script
 * @param email email input
 * @param password password input
 * @returns 
 */
export const login = async (email: string, password: string) => {
  const loginData = {  
    'email': email,
    'password': password
  };
  const res = await adminController.postAdminLogin(loginData);
  //console.log(res.body);

  return res.body.token;
};

export const postCategory = async (data: {[key: string]: string | number}, token: string) => {
  return await catergoriesController.postCategories(data).set('Authorization', `Bearer ${token}`);
};

export const getCategoryId = async (request) => {
  return request.body._id;
};
