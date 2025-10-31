

### start app

1. 先启动api服务
这个项目只是前端展示页面，通过api请求数据。
api服务位于Artwork-database项目中，是node.js服务。

2. 启动该项目
菜单run-> start debugging (在`lunch.json`配置`npm start`命令)
或直接在terminal中运行：
> `> npm run start`

3. router
该项目包含两部分：
- 根目录访问/ 直接进入管理后台
- 通过/vincent进入前端展示页面。详情见 `App.tsx`文件

4. 解决问题的方法
- > npm cache clean --force  清理本地缓存
- 删除node_modules\package-lock.json，重新安装 npm install