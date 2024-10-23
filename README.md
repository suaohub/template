# LESOON 3.0 模块生成器

这是一个基于UmiJS框架的React应用,用于快速生成LESOON 3.0项目的常规模块。

## 功能特点

- 单表模块生成
- 主从表模块生成(开发中)
- 自动生成前端代码和服务文件
- 自动更新路由配置

## 安装 

`yarn`

## 运行
`yarn start | npm start`

## 使用方法

1. 启动应用后,访问 http://localhost:8000
2. 在界面上选择"单表"选项卡
3. 填写基础配置和服务配置
4. 在表格字段配置中添加需要的字段
5. 点击"生成模块文件"按钮

## Template模块使用说明

Template模块是本项目的核心,位于 `src/pages/template` 目录下。它主要包含以下部分:

1. `index.tsx`: 主界面,包含单表和主从表的选项卡
2. `singleTable/index.tsx`: 单表配置界面
3. `singleTable/singleTable.js`: 单表代码生成脚本
4. `singleTable/singleTable.hbs`: 单表组件模板
5. `singleTable/singleTableService.hbs`: 单表服务模板

### 使用流程

1. 用户在界面上填写配置信息
2. 点击"生成模块文件"按钮
3. 前端发送请求到本地服务器(server.js)
4. 服务器执行singleTable.js脚本
5. 脚本使用Handlebars模板引擎生成代码
6. 生成的代码被写入指定目录
7. 更新.umirc.ts中的路由配置
