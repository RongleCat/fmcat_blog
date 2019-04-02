# 花喵电台

## 前台技术栈

`vue`
`vuex`
`vue-router`
`element-ui`
`axios`
`mavon-editor`

### 音乐推荐
后端添加音乐，背景图片，图片来源，可切换上一曲下一曲，每次加载音乐顺序随机。

### 博客页面
博客分类，按时间分组展示

### 前端作品展示
iframe展示单个效果

### 设计作品展示
图片形式展示设计作品

### 聊天室
花喵冒险岛聊天室将移植合并进花喵电台，敬请期待


## 后台技术栈
`node.js`
`koa2`
`knex`
`mysql`
`socket.io`

### 关于文件存储
系统内相关文件存储都使用了阿里云oss对象存储，这么做是因为花喵个人服务器的带宽只有1M，文件从服务器下载的话，带宽压力会很大。影响页面加载速度

### 关于部署
`client` 运行 `yarn build`
`server` 在服务器上用 `pm2` 做进程守护，本地使用 `nodemon` 监听文件修改

为了进一步减轻服务器压力，前台部分build以后也部署在oss上，用单个存储桶做静态网站托管。
个人服务器上只运行api接口服务和聊天室websocket服务

### 关于使用
如果有幸被您青睐使用本系统，下载后需修改以下几处文件内容
`server/util/oss.js`内的oss相关参数
`server/util/sql_client.js`内的mysql连接参数

`client/plugins/axios.js`内的axios拦截代码里的拼接URL