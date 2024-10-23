const { spawn } = require('child_process');
const path = require('path');

// 定义服务文件的路径
const serverPath = path.join(
  __dirname,
  'src',
  'pages',
  'template',
  'server.js',
);

// 启动前端服务
const frontend = spawn('npm', ['run', 'start:frontend'], {
  stdio: 'inherit',
  shell: true,
});

// 启动后端服务
const backend = spawn('node', [serverPath], { stdio: 'inherit', shell: true });

// 错误处理
frontend.on('error', (error) => {
  console.error(`前端服务错误: ${error}`);
});

backend.on('error', (error) => {
  console.error(`后端服务错误: ${error}`);
});

// 进程退出处理
process.on('SIGINT', () => {
  frontend.kill('SIGINT');
  backend.kill('SIGINT');
  process.exit();
});
// "start": "node start.js",
// "start:frontend": "umi dev",
// "start:backend": "node src/pages/template/server.js",
