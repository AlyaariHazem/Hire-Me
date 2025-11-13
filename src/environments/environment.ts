export const environment = {
  production: true,
  apiBaseUrl: 'https://job-portal-rcxk.onrender.com',
  getUrl: (method: string, module_entity: string = 'accounts') => {
    const base = `https://job-portal-rcxk.onrender.com/api/${module_entity}`;
    return method === '' ? base : `${base}/${method}/`;
  }
};
