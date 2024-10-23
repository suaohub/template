import React, { useState } from 'react';
import { message, Row, Col, Space } from 'antd';
import ProForm, { ProFormText, ProFormRadio } from 'ls-pro-form';
import { log } from 'handlebars';
import { httpPost } from 'ls-pro-common';
import { clearConfigCache } from 'prettier';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
const path = require('path');
import SingleTable from './singleTable';
export default () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '30px',
      }}
    >
      <h1>LESOON 3.0 常规模块生成</h1>
      <Tabs
        defaultActiveKey="1"
        style={{ width: '100%' }}
        items={[
          {
            key: '1',
            label: '单表',
            children: <SingleTable />,
          },
          {
            key: '2',
            label: '主从表',
            children: 'Content of Tab Pane 2',
          },
        ]}
      />
    </div>
  );
};
