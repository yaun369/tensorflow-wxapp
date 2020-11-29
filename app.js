//app.js
var fetchWechat = require('fetch-wechat');
var tf = require('@tensorflow/tfjs-core');
var webgl = require('@tensorflow/tfjs-backend-webgl');
var cpu = require('@tensorflow/tfjs-backend-cpu');
var plugin = requirePlugin('tfjsPlugin');
App({
  onLaunch: function () {
    this.getDeviceInfo();
    tf.ENV.flagRegistry.WEBGL_VERSION.evaluationFn = () => { return 1 };
    plugin.configPlugin({
      // polyfill fetch function
      fetchFunc: fetchWechat.fetchFunc(),
      // inject tfjs runtime
      tf,
      // inject webgl backend
      webgl,
      // inject cpu backend
      cpu,
      // provide webgl canvas
      canvas: wx.createOffscreenCanvas()
    });
    // tf.tensor([1, 2, 3, 4]).print();
  },
  getDeviceInfo() {
    try {
      const res = wx.getSystemInfoSync();
      this.globalData.appWidth = typeof res.screenWidth === 'number' ? res.screenWidth : 320;
      this.globalData.appHeight = typeof res.screenHeight === 'number' ? res.screenHeight : 500;
      this.globalData.benchmarkLevel = typeof res.benchmarkLevel === 'number' ? res.benchmark : -1;
    } catch (e) {
      console.log(e);
    }
  },
  globalData: {
    appWidth: 320,
    appHeight: 500,
    benchmarkLevel: -1
  }
})