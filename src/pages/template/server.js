const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());

app.post('/run-script', (req, res) => {
  const {
    tableType,
    folderPath,
    folderName,
    indexName,
    serviceFolderName,
    serviceFileName,
    config,
  } = req.body;
  const fullPath = path.join(folderPath || path.dirname(__dirname), folderName);

  // 生成结果  error : 执行状态  stdout: 脚本文件singleTable.js 的 console
  const createResultHandle = (error, stdout) => {
    if (error) {
      console.error('执行脚本时出错:', error);
      return res.status(504).send(`错误: ${error.message}`);
    }
    console.log(stdout); // 输出到终端
    // 检查组件文件是否成功创建
    const componentFilePath = path.join(fullPath, `${indexName}`);
    if (fs.existsSync(componentFilePath)) {
      updateUmiConfig(folderName, indexName);
      return res.status(200).send({
        flag: {
          retCode: 0,
          retMsg: `组件文件创建成功: ${stdout}`,
        },
      });
    } else {
      return res.status(500).send({
        flag: {
          retCode: 9009,
          retMsg: `组件文件创建失败: ${componentFilePath}`,
        },
      });
    }
  };

  const updateUmiConfig = (folderName, indexName) => {
    const umircPath = path.resolve(__dirname, '../../../.umirc.ts');
    let umircContent = fs.readFileSync(umircPath, 'utf8');

    // 解析现有的路由配置
    const routesMatch = umircContent.match(/routes:\s*\[([\s\S]*?)\]/);
    if (routesMatch) {
      const existingRoutes = routesMatch[1];
      const newRoute = `
    {
      path: '/${folderName}',
      component: '@/pages/${folderName}',
      title:'${config.moduleName}' // ${config.moduleDesc}
    },`;

      // 在404路由之前插入新路由
      const updatedRoutes = existingRoutes.replace(
        /(\s*\{\s*component:\s*'@\/components\/404'\s*\})/,
        `${newRoute}$1`,
      );

      // 更新.umirc.ts文件
      umircContent = umircContent.replace(
        routesMatch[0],
        `routes: [${updatedRoutes}]`,
      );
      fs.writeFileSync(umircPath, umircContent);
      console.log(`已更新.umirc.ts文件,添加了新路由: /${folderName}`);
    } else {
      console.error('无法在.umirc.ts中找到routes配置');
    }
  };
  if (tableType === 'singleTable') {
    // 创建文件夹 && 生成组件
    fs.mkdir(fullPath, { recursive: true }, (error) => {
      const scriptPath = path.resolve(
        __dirname,
        'singleTable',
        'singleTable.js',
      );
      exec(
        `node "${scriptPath}" "${fullPath}" "${indexName}" '${JSON.stringify(
          config,
        ).replace(/'/g, "'\\''")}' "${serviceFolderName}" "${serviceFileName}"`,
        createResultHandle,
      );
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
