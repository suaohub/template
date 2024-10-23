import React, { useMemo, useRef, useState } from 'react';
import { message, Row, Col, Space } from 'antd';
import ProForm, {
  ProFormText,
  ProFormRadio,
  ProFormList,
  ProFormSelect,
} from 'ls-pro-form';
import type { ProFormInstance } from 'ls-pro-form';
import { EditableProTable } from 'ls-pro-table';
import { log } from 'handlebars';
import { httpPost } from 'ls-pro-common';
import { clearConfigCache } from 'prettier';
import { Tabs, Button, Switch } from 'antd';
import ProCard from 'ls-pro-card';
import type { TabsProps } from 'antd';
import type { ProColumns } from 'ls-pro-table';
import type { EditableFormInstance } from 'ls-pro-table/es/components/EditableTable';
import { deepClone, showError, showSuccess } from 'ls-pro-common/lib/utils';
import MiniLayout from '@/components/MiniLayout';
import './index.less';

// 单表
export default () => {
  const formRef = useRef<ProFormInstance>();
  const editRef: any = useRef<EditableFormInstance>(null);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<any>([]);
  // 生成
  const onFinish = async (values: any) => {
    const {
      folderPath,
      folderName,
      indexName,
      serviceFolderName,
      serviceFileName,
      addUrl,
      loadUrl,
      editUrl,
      deleteUrl,
      ...config
    } = values;
    let tableData = editRef.current?.getRowsData() || [];
    let temp = tableData.map((item: any) => {
      const { id, queryType, search, hideInTable, ...rest } = item;
      return {
        ...rest,
        hideInTable,
        search,
        width: Number(item.width),
      };
    });

    const newValues = {
      tableType: 'singleTable',
      folderPath,
      folderName,
      indexName,
      serviceFolderName,
      serviceFileName,
      config: {
        ...config,
        tableColumns: temp,
        services: {
          addUrl,
          loadUrl,
          editUrl,
          deleteUrl,
        },
      },
    };
    fetch('http://localhost:3000/run-script', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newValues),
    }).then(async (res) => {
      let { flag } = JSON.parse(await res.text());
      !flag?.retCode && showSuccess(flag?.retMsg);
      flag?.retCode && showError(flag?.retMsg);
    });
  };

  const columns: ProColumns[] = useMemo(() => {
    const originColumns: ProColumns[] = [
      {
        title: '列字段名称',
        dataIndex: 'title',
        formItemProps: (form: any, { rowIndex }: any) => {
          return {
            rules: [{ required: true, message: '此项为必填项' }],
          };
        },
      },
      {
        title: '列字段',
        dataIndex: 'dataIndex',
        formItemProps: (form: any, { rowKey, rowIndex }: any) => {
          return {
            rules: [{ required: true, message: '此项为必填项' }],
            onBlur: () => {
              const allValues = form.getFieldsValue();
              const rowData = allValues[rowKey];
              if (rowData) {
                const searchField = rowData.queryType
                  ? `${rowData.dataIndex}${rowData.queryType}`
                  : rowData.dataIndex;

                form.setFieldsValue({
                  [rowKey]: { ...rowData, searchField },
                });
              }
            },
          };
        },
      },
      {
        title: '查询类型',
        dataIndex: 'queryType',
        valueType: 'select',
        fieldProps: (form: any, { rowKey, entity, rowIndex }: any) => {
          return {
            options: [
              { value: '_like', label: '单边模糊' },
              { value: '_allLike', label: '全模糊' },
            ],
            onChange: (value: string) => {
              const allValues = form.getFieldsValue();
              const rowData = allValues[rowKey];
              if (rowData) {
                const searchField = `${rowData.dataIndex}${value}`;
                form.setFieldsValue({
                  [rowKey]: { ...rowData, searchField },
                });
              }
            },
          };
        },
      },
      {
        title: '查询字段',
        dataIndex: 'searchField',
        formItemProps: (form: any, { rowIndex }: any) => {
          return {
            rules: [{ required: true, message: '此项为必填项' }],
          };
        },
      },
      {
        title: '列宽',
        dataIndex: 'width',
        formItemProps: (form: any, { rowIndex }: any) => {
          return {
            initialValue: '100',
            rules: [{ required: true, message: '此项为必填项' }],
          };
        },
      },
      {
        title: '支持查询',
        dataIndex: 'search',
        width: 90,
        formItemProps: (form: any, { rowIndex }: any) => {
          return {
            initialValue: false,
          };
        },
        renderFormItem: (_, { record }) => (
          <Switch
            checkedChildren="是"
            unCheckedChildren="否"
            defaultChecked={record?.search}
          />
        ),
      },
      {
        title: '表格隐藏',
        dataIndex: 'hideInTable',
        width: 90,
        formItemProps: (form: any, { rowIndex }: any) => {
          return {
            initialValue: false,
          };
        },
        renderFormItem: (_, { record }) => (
          <Switch
            checkedChildren="是"
            unCheckedChildren="否"
            defaultChecked={record?.hideInTable}
          />
        ),
      },
      {
        title: '操作',
        valueType: 'option',
        width: 200,
        render: (text: any, record: any, _: any, action: any) => [
          <a
            key="editable"
            onClick={() => {
              action?.startEditable?.(record.id);
            }}
          >
            编辑
          </a>,
          <a
            key="delete"
            onClick={() =>
              setDataSource(dataSource.filter(({ id }: any) => id !== id))
            }
          >
            删除
          </a>,
        ],
      },
    ];
    return originColumns.map((item: ProColumns) => ({
      ...item,
      tooltip: `对应表格属性 ${item.dataIndex}`,
      width: item.width || 200,
    }));
  }, []);

  // 基础配置
  const baseForm = (
    <>
      <ProFormText
        width="md"
        name="folderPath"
        label="绝对路径"
        tooltip="不填写默认生成在当前项目pages目录下"
        placeholder="文件生成目标路径"
      />
      <ProFormText
        width="md"
        name="folderName"
        label="文件夹名称"
        placeholder="注意小驼峰命名 例: adjustPrice"
        rules={[{ required: true, message: '此项必填' }]}
      />
      <ProFormText
        width="md"
        name="indexName"
        label="首页文件名"
        placeholder="注意小驼峰命名 例: adjustPrice"
        rules={[{ required: true, message: '此项必填' }]}
      />
      <ProFormText
        width="md"
        name="moduleName"
        label="模块名称"
        placeholder="首页文件顶部注释"
        rules={[{ required: true, message: '此项必填' }]}
      />
      <ProFormText
        width="md"
        name="moduleDesc"
        label="模块描述"
        placeholder="首页文件顶部注释"
        rules={[{ required: true, message: '此项必填' }]}
      />
      <ProFormText
        width="md"
        name="serviceFolderName"
        label="服务文件夹名称"
        placeholder="注意小驼峰命名 例: adjustPrice"
        rules={[{ required: true, message: '此项必填' }]}
      />
      <ProFormText
        width="md"
        name="serviceFileName"
        label="服务文件名称"
        placeholder="注意小驼峰命名 例: adjustPrice"
        rules={[{ required: true, message: '此项必填' }]}
      />
    </>
  );

  // 服务配置
  const serviceForm = [
    <ProFormText
      width="md"
      name="loadUrl"
      label="查询"
      tooltip="查询URL"
      rules={[{ required: true, message: '此项必填' }]}
    />,
    <ProFormText width="md" name="addUrl" label="新增" tooltip="新增URL" />,
    <ProFormText width="md" name="deleteUrl" label="删除" tooltip="删除URL" />,
    <ProFormText width="md" name="editUrl" label="编辑" tooltip="编辑URL" />,
  ];

  // 卡片list
  const formCardList = [
    <ProCard
      title="基础配置"
      className="my-pro-card-style"
      bodyStyle={{
        flexWrap: 'wrap',
      }}
    >
      {baseForm}
    </ProCard>,
    <ProCard
      title="服务配置"
      className="my-pro-card-style"
      bodyStyle={{
        flexWrap: 'wrap',
      }}
    >
      {serviceForm}
    </ProCard>,
  ];

  return [
    <ProForm
      key="ProForm"
      formRef={formRef}
      initialValues={{
        indexName: 'index.tsx',
        serviceFolderName: 'services', // 新增
        serviceFileName: 'index.ts', // 新增
        folderName: 'newModule',
      }}
      className="ant-row singleTable"
      itemCol={6}
      layout="horizontal"
      submitter={false}
      labelCol={{ span: 8 }}
      onFinish={onFinish}
    >
      {formCardList}
    </ProForm>,
    <EditableProTable
      key="EditableProTable"
      rowKey="id"
      headerTitle="表格字段配置"
      height={500}
      manualRequest={false}
      className="singleTable"
      onChange={setDataSource}
      recordCreatorProps={{
        position: 'bottom',
        newRecordType: 'dataSource',
        record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
      }}
      editableFormRef={editRef}
      toolBarRender={() => [
        <Button
          type="primary"
          key="save"
          onClick={() => {
            formRef?.current?.submit();
          }}
        >
          生成模块文件
        </Button>,
      ]}
      columns={columns}
      value={dataSource}
      editable={{
        type: 'multiple',
        editableKeys,
        onChange: setEditableRowKeys,
        actionRender: (row, config, defaultDoms) => {
          return [defaultDoms.delete];
        },
        onValuesChange: (record, recordList) => {
          setDataSource(recordList);
        },
      }}
    />,
  ];
};
