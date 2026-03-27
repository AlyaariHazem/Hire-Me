export const environment = {
  production: true,
  apiBaseUrl: 'https://tawthif-backend.onrender.com',
  getUrl: (method: string, module_entity: string = 'accounts') => {
    const base = `https://tawthif-backend.onrender.com/api/${module_entity}`;
    return method === '' ? base : `${base}/${method}/`;
  }
};
