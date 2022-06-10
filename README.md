## Reload nginx.conf

### 思路

1. 监听前端 proxy 文件 发生修改
2. 取出前端 proxy 文件中的 target,替换 nginx 中的地址
3. 重启 nginx

### 依赖: shelljs
