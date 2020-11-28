// pages/posenet/index.js
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
    devicePosition: 'front',
    predicting: false
  },
  handleSwitchCamera() {
    let devicePosition = this.data.devicePosition === 'front' ? 'back' : 'front';
    this.setData({ devicePosition });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(appWidth, appHeight);
  },
  onCameraError(err) {
    console.log('onCameraError>>', err);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    const context = wx.createCameraContext();
    this.ctx = wx.createCanvasContext('pose', this);
    this.initClassifier();
    const listener = context.onCameraFrame((frame) => {
      this.executeClassify(frame);
    });
    listener.start();
  },

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

  executeClassify(frame) {
    if (this.classifier && this.classifier.isReady() && !this.data.predicting) {
      this.setData({
        predicting: true
      }, () => {
        this.classifier.detectSinglePose(frame).then((pose) => {
          const nosePosition = pose.keypoints[0].position;
          this.classifier.drawSinglePose(this.ctx, pose);
          this.setData({
            predicting: false,
            nosePosition: Math.round(nosePosition.x) + ', ' + Math.round(nosePosition.y)
          })
        }).catch((err) => {
          console.log(err, err.stack);
        });
      });
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
      title: '微信小程序 × PoseNet',
      path: '/pages/posenet/index',
      imageUrl: '/static/img/share-img.png'
    }
  },
  onAddToFavorites() {
    return {
      title: '微信小程序 × PoseNet',
      imageUrl: '/static/img/app-avatar.png'
    }
  }
})