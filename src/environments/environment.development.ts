export const environment = {
  production: false,
  apiBaseUrl: 'https://job-portal-rcxk.onrender.com',
  getUrl: (method: string, module_entity: string = "accounts"): string => {
    return environment.apiBaseUrl + "/api/" + module_entity + "/" + method + "/";
  }
};
