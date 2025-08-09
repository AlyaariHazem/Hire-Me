// export const environment = {};
export const apiBaseUrl = 'https://job-portal-rcxk.onrender.com';
export function getUrl(method:string,module_entity:string="accounts"):string {
 // this saned_module if we need to get data from another module the defualt = 'SanedLossIntelligence'
  //return  "https://"+env_param.env_currentTenantOrDefault+"."+env_param.env_apiHost+"/api/default/"+saned_module+"/"+module_entity+"/"+env_param.module_entity_version+"/"
  return apiBaseUrl+"/api/"+module_entity+"/"+method+"/"
}
