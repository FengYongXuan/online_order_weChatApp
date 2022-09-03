## 配置

**前提**：首先注册微信小程序，并拿到开发者ID(**AppID**)和密码(**AppSecre**t)，注意和微信公众号的AppID区分开来(用测试号也可以)

**前端小程序页面打开步骤**：

①使用微信开发者工具(建议用最新的)导入 client 文件夹，记得输入**AppID**

②编译运行

**后台运行(默认为本地127.0.0.1:3000)**：

①安装mysql，导入online_order.sql表数据到你的数据库中

②修改server/db/dbConfig.js文件，改为你自己的数据库配置

③修改server/routes/customer.js里面的**AppSecret**

④npm install

⑤npm start

## 技术栈

前端： 微信小程序原生框架 + weui  

后端：node.js+express

数据库：mysql

## 其它说明见我的博客

[微信点餐小程序项目 --- 干饭人联盟(开源、免费)_劳埃德·福杰的博客-CSDN博客](https://blog.csdn.net/YINZHE__/article/details/126677261?spm=1001.2014.3001.5501)


