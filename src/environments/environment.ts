export const environment = {
  production: true,
  apiBaseUrl: 'https://job-portal-rcxk.onrender.com',
  getUrl: (method: string, module_entity: string = 'accounts') =>
    `https://job-portal-rcxk.onrender.com/api/${module_entity}/${method}/`
};
