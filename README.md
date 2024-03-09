# 2024-magic-vue

在抖音看到渡一老师讲了2024春晚刘谦魔术的前端实现.由于没找到他的源码,就按照他的思路自己实现了一个.用的vue3,没用ts.

## 在线预览
[https://qxl2006521.github.io/2024-magic-vue/](https://qxl2006521.github.io/2024-magic-vue/)
## 原教程
[渡一教程](https://www.douyin.com/video/7339410981212163363).

## 运行方法
 ```sh
npm install
npm run dev
```
## 程序截图
![1](https://raw.githubusercontent.com/qxl2006521/2024-magic-vue/main/screenshot/1.png)
![3](https://raw.githubusercontent.com/qxl2006521/2024-magic-vue/main/screenshot/3.png)
![5](https://raw.githubusercontent.com/qxl2006521/2024-magic-vue/main/screenshot/5.png)
![7](https://raw.githubusercontent.com/qxl2006521/2024-magic-vue/main/screenshot/7.png)
![9](https://raw.githubusercontent.com/qxl2006521/2024-magic-vue/main/screenshot/9.png)
![11](https://raw.githubusercontent.com/qxl2006521/2024-magic-vue/main/screenshot/11.png)
![12](https://raw.githubusercontent.com/qxl2006521/2024-magic-vue/main/screenshot/12.png)

## 项目最难点
花费大量时间找扑克牌图片...

## 已知BUG
* 每一步要等动画完成才能点下一步.快速点下一步可能出错.
## 修复方法:
* 下一步按钮添加disable属性.完成动画后按钮可用.或者直接给按钮添加节流也行.
## 预计修复时间:
* 待定
## IDE

[VSCode](https://code.visualstudio.com/)


