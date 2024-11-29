/**
 * @module: 21
 * @description: 21
 */

import { useEffect, useMemo } from 'react';
import type { ProColumns } from 'ls-pro-table';
import ProTable from 'ls-pro-table';
import { ProFormText, ModalForm } from 'ls-pro-form';
import { ApiResponse, InputTable, useSingle, utils } from 'ls-pro-common';
import type { TableToolbar } from 'ls-pro-common';
import Service from './services';
import { appPath, toGatewayUrl } from 'ls-pro-common/lib/utils';
const { showWarn, showSuccess } = utils;

// TS类型声明
type ResourceType = {
  id?: string;
  status?: number;
  creator?: string;
  createTime?: string;
  modifier?: string;
  modifyTime?: string;
  remarks?: string;
};
const service = new Service();

// 对象初始值,新增时设置默认值
const item: ResourceType = {};

// 编辑弹窗
const EditPage = (props: any) => {
  const { editItem, showEdit, setShowEdit, onSave, editFormRef } = props;
  return (
    <ModalForm<ResourceType>
      title={editItem.id ? '编辑' : '新增'}
      visible={showEdit}
      width={600}
      itemCol={24}
      onFinish={onSave}
      onVisibleChange={setShowEdit}
      initialValues={{ ...editItem }}
      formRef={editFormRef}
      showKeepAdd
    ></ModalForm>
  );
};
export default (props: any) => {
  const {
    tableRef,
    editFormRef,
    tableTools,
    showEdit,
    editItem,
    selectedRows,
    setShowEdit,
    onLoad,
    onSave,
    setSelectedRows,
    onExport,
  } = useSingle({
    service,
    toolConfig: {
      add: true,
      edit: true,
      remove: true,
    },
    initItem: item,
  });

  useEffect(
    () => {},
    [
      // 获取数据字典
    ],
  );

  const columns: ProColumns<ResourceType>[] = useMemo(
    () => [
      {
        title: '生效日期',
        dataIndex: 'takeEffectDate',
        searchField: 'takeEffectDate_like',
        width: 100,
      },
      {
        title: '支援方',
        dataIndex: 'supportOrgPathName',
        searchField: 'supportOrgPathName_like',
        width: 100,
      },
    ],
    [],
  );

  return (
    <>
      <ProTable<ResourceType>
        columns={columns}
        actionRef={tableRef}
        request={onLoad}
        rowKey="id"
        height={'full'}
        rowSelection={{
          alwaysShowAlert: true,
          onChange: (keys, rows) => setSelectedRows(rows),
        }}
        exportConfig={{
          bizApi: service.api.load,
          onExport: onExport,
        }}
        importConfig={{
          colNames: 'resourceId,resourceName,url,descRibe,remarks',
          mustArray: 'true,true,true,true,false',
          bizApi: toGatewayUrl(
            '/lesoon-petrel-integration-api/sysUrlresourceRelation/importData',
            'gateway',
            '',
          ),
          ifBig: false,
          startIndex: 5,
          reloadOnImported: true,
          async: false,
          filePath: `${appPath()}import-template/资源请求描述导入模板.xlsx`,
        }}
        toolBarRender={() => tableTools}
      />
      <EditPage
        onSave={onSave}
        showEdit={showEdit}
        editItem={editItem}
        setShowEdit={setShowEdit}
        editFormRef={editFormRef}
      />
    </>
  );
};
