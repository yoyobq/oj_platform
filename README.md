# oj-platform #
基于Vue.js 2.x系列 + Element UI 的一个在线测试网站前台。

## 前言 ##
首先要感谢分享vue，element，egg的团队，给了我们方便的轮子。然后要感谢lin-xin提供的vue + element整合方案，让我能快速搭建一个前台。

## 功能 ##
- [x] 注册
- [x] 登录/注销
- [x] 平台首页
- [x] 题库一览
- [x] 教师出题
- [x] 学生做题
- [x] 查看做题情况
- [x] 支持从后台获取的权限分配
- [x] 404 / 403


## 目录结构介绍 ##

	|-- build                            // webpack配置文件
	|-- config                           // 项目打包路径
	|-- src                              // 源码目录
	|   |-- components                   // 组件
	|       |-- common                   // 公共组件
	|           |-- bus.js           	   // Event Bus
	|           |-- Header.vue           // 公共头部
	|           |-- Home.vue           	 // 公共路由入口
	|           |-- Sidebar.vue          // 公共左边栏
	|           |-- Tags.vue           	 // 页面切换标签组件
	|       |-- page                   	 // 主要路由页面
	|           |-- ....                 // 各类功能组件
	|   |-- App.vue                      // 页面入口文件
	|   |-- main.js                      // 程序入口文件，加载各种公共组件
	|-- .babelrc                         // ES6语法编译配置
	|-- .editorconfig                    // 代码编写规格
	|-- .gitignore                       // 忽略的文件
	|-- index.html                       // 入口html文件
	|-- package.json                     // 项目及工具的依赖配置文件
	|-- README.md                        // 说明


## 安装步骤 ##

	git clone https://github.com/361037067/oj_platform    // 把模板下载到本地
	cd oj_paltform    // 进入模板目录
	npm install        // 安装项目依赖，等待安装完成之后

## 本地开发 ##

	// 开启服务器，浏览器访问 http://localhost:8080
	npm run dev

## 构建生产 ##

	// 执行构建命令，生成的dist文件夹放在服务器下即可访问
	npm run build