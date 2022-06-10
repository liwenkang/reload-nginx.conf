const shell = require("shelljs");
const fs = require("fs");
const open = require("open");

const proxyFilePath =
  "/Users/liwenkang/Desktop/program/waiqin365-appsvr/public/setupProxy.config.json";
const nginxFilePath = "/usr/local/etc/nginx/nginx.conf";

console.log(`正在监听 proxy 的配置文件 ${proxyFilePath}`);
// 1. 监听 proxyFilePath 发生修改
fs.watch(proxyFilePath, (event, filename) => {
  if (filename) {
    try {
      // 2. 取出 target,准备替换 nginx
      const data = fs.readFileSync(proxyFilePath, "utf8");
      const config = JSON.parse(data);
      const target = config.params.target;

      const nginxText = fs.readFileSync(nginxFilePath, "utf8");
      const nginxTextArray = nginxText.split("\n");
      const newProxyText = `            proxy_pass ${target};`;

      if (newProxyText !== nginxTextArray[6]) {
        nginxTextArray[6] = `            proxy_pass ${target};`;
      } else {
        console.log("未修改 nginx 地址");
        return;
      }
      const result = nginxTextArray.join("\n");
      fs.writeFile(nginxFilePath, result, "utf8", async (err) => {
        if (err) {
          console.error("重启 nginx 失败", err);
          return;
        } else {
          console.log("重启 nginx 成功", target);
          // 3. 重启 nginx
          shell.exec("nginx -s reload");
          await open("http://localhost:3002/auto/login");
          setTimeout(async () => {
            await open("http://localhost:9091/portal/main.action");
          }, 1000);
        }
      });
    } catch (e) {
      console.log("快看看哪里出问题了", e);
    }
  }
});
