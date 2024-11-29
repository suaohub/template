import { BaseService, MethodType } from 'ls-pro-common';

export default class ResourceRequestDescriptionService extends BaseService {
  // 定义api
  api = {
    load: '/lesoon-hris-ehr-api/ehrDispatchRule/customPage',
    add: '/lesoon-hris-ehr-api/ehrDispatchRule/add',
    delete: '/lesoon-hris-ehr-api/ehrDispatchRule/batch',
    edit: '/lesoon-hris-ehr-api/ehrDispatchRule/update',
  };

  // method: MethodType = {
  //   get: 'get',
  //   edit: 'post',
  //   delete: 'delete',
  // }
}
