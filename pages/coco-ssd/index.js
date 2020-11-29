// pages/coco-ssd/index.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import { Classifier } from './models';
const { appWidth, appHeight, benchmarkLevel } = getApp().globalData;

Page({
  classifier: null,
  ctx: null,
  /**
   * 页面的初始数据
   */
  data: {
    predicting: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.ctx = wx.createCanvasContext('ssd');
    const context = wx.createCameraContext(this);
    this.initClassifier();
    let count = 0;
    const listener = context.onCameraFrame(frame => {
      count++;
      if (count === 4) {
        if (this.classifier && this.classifier.isReady()) {
          this.executeClassify(frame);
        }
        count = 0;
      }
    });
    listener.start();
  },

  /**
   * 初始化 SSD models
   */
  initClassifier() {
    wx.showLoading({ title: '模型正在加载...' });
    this.classifier = new Classifier({ width: appWidth, height: appHeight });
    this.classifier.load().then(() => {
      wx.hideLoading();
    }).catch(err => {
      console.log('模型加载报错：', err);
      Toast.loading({
        message: '网络连接异常',
        forbidClick: true,
        loadingType: 'spinner',
      });
    })
  },

  /**
   * 构建模型
   */
  executeClassify: function (frame) {
    if (this.classifier && this.classifier.isReady() && !this.data.predicting) {
      this.setData({
        predicting: true
      }, () => {
        this.classifier.detect(frame).then(res => {
          // console.log(res)
          this.classifier.drawBoxes(this.ctx, res);
          this.data.predicting = false;
        }).catch((err) => {
          console.log(err)
        })
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.classifier && this.classifier.isReady()) {
      this.classifier.dispose();
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '微信小程序 × Coco SSD',
      path: '/pages/coco-ssd/index',
      imageUrl: '/static/img/share-img.png'
    }
  },
  onAddToFavorites() {
    return {
      title: '微信小程序 × Coco SSD',
      imageUrl: '/static/img/app-avatar.png'
    }
  }
})