# tensorflow-wxapp

[TensorFlow.js](https://tensorflow.google.cn/js/?hl=zh_cn)是一个 `JavaScript` 库，用于在浏览器和 `Node.js` 上训练和部署机器学习模型。

同样的，现在也可以在微信小程序里使用 `TensorFlow` 团队提供的插件，运行一些开箱即用的预训练模型。

现在项目中已经引入：[实时估计人体姿势(PoseNet)](https://github.com/tensorflow/tfjs-models/tree/master/posenet)和定位和[识别单个图像中的多个对象(Coco SSD)](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd)两个模型。

## 快速开始

* 首先需要在小程序后台添加`TensorFlow.js`插件，[参考此文档。](https://mp.weixin.qq.com/wxopen/plugindevdoc?appid=wx6afed118d9e81df9&token=378013697&lang=zh_CN)

* 在项目根目录下安装项目需要用到的`npm`包，使用`yarn`或者`npm`都可。

```bash
yarn install
```

* 注意：安装好`npm`包后一定有在开发者工具里**构建`npm`**。可以参考微信官方文档，[在小程序中使用npm](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)。

* 修改根目录下的`env.js.example`文件，把其中的模型地址替换成你的模型地址。

## 线上版本

微信搜索：**TensorFlow机器学习模型**。或者扫码：
![TensorFlow机器学习模型](https://star-1257061493.cos.ap-beijing.myqcloud.com/tensorflow/qrcode.jpg)
