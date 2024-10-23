const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const { log } = require('console');

// 获取命令行参数
// process.argv 是一个包含命令行参数的数组,前两个元素被忽略(通常是 Node.js 执行路径和脚本文件路径)。
const [
  ,
  ,
  outputDir,
  indexName,
  configString,
  serviceFolderName,
  serviceFileName,
] = process.argv;
const config = JSON.parse(configString);
console.log(
  config,
  '/lesoon-petrel-integration-api/sysUrlresourceRelation/update',
);
if (!outputDir || !indexName || !serviceFolderName || !serviceFileName)
  process.exit(1); // 立即退出

// 读取两个模板文件的内容;
const indexTemplateSource = fs.readFileSync(
  path.join(__dirname, 'singleTable.hbs'),
  'utf8',
);
const serviceTemplateSource = fs.readFileSync(
  path.join(__dirname, 'singleTableService.hbs'),
  'utf8',
);
// 使用 Handlebars 编译模板
const indexTemplate = Handlebars.compile(indexTemplateSource);
const serviceTemplate = Handlebars.compile(serviceTemplateSource);

// 生成最终代码
const generatedIndexCode = indexTemplate(config);
const generatedServiceCode = serviceTemplate(config.services);

try {
  // 确保输出目录存在
  fs.mkdirSync(outputDir, { recursive: true });

  // 创建服务文件夹
  const serviceFolderPath = path.join(outputDir, serviceFolderName);
  fs.mkdirSync(serviceFolderPath, { recursive: true });

  // 将生成的索引代码写入文件
  const indexOutputPath = path.join(outputDir, indexName);
  fs.writeFileSync(indexOutputPath, generatedIndexCode);
  console.log(`组件 ${indexName} 已生成在 ${indexOutputPath}`);

  // 将生成的服务代码写入文件
  const serviceOutputPath = path.join(serviceFolderPath, serviceFileName);
  fs.writeFileSync(serviceOutputPath, generatedServiceCode);
  console.log(`服务文件 ${serviceFileName} 已生成在 ${serviceOutputPath}`);
} catch (error) {
  console.error(`写入文件失败: ${error.message}`);
  process.exit(1);
}
