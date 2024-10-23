import { BaseService, MethodType } from 'ls-pro-common';

export default class ResourceRequestDescriptionService extends BaseService {
  // 定义api
  api = {
    load: '32',
    add: '32',
    delete: '32',
    edit: '3',
  };

  // method: MethodType = {
  //   get: 'get',
  //   edit: 'post',
  //   delete: 'delete',
  // }
}
