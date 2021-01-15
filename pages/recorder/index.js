// pages/recorder/index.js
import pcmToPowerLevel from './utils';
const recorderManager = wx.getRecorderManager();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /**
     * start
     * stop
     * pause
     */
    buttonStatus: 'start',
    powerLevel: 0
  },

  /**
   * 点击开始
   */
  handleClickStart() {
    const options = {
      duration: 60000,
      sampleRate: 16000,
      encodeBitRate: 96000,
      format: 'PCM',
      frameSize: 1
    };
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.record']) {
          recorderManager.start(options);
          this.setData({ buttonStatus: 'stop' });
        } else {
          wx.openSetting();
        }
      }
    });
  },

  /**
   * 点击继续
   */
  handleClickContinue() {
    recorderManager.resume();
    this.setData({ buttonStatus: 'stop' });
  },

  /**
   * 点击结束
   */
  handleClickStop() {
    recorderManager.stop();
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.record']) { wx.authorize({ scope: 'scope.record' }); }
      }
    });

    recorderManager.onPause(() => {
      this.setData({ buttonStatus: 'pause' });
    });

    recorderManager.onStop(() => {
      this.setData({ buttonStatus: 'start' });
    });

    recorderManager.onFrameRecorded(res => {
      const { frameBuffer } = res;
      let result = pcmToPowerLevel(frameBuffer);
      this.setData({ powerLevel: result });
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    recorderManager.pause();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    recorderManager.stop();
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
      title: '小程序实时解析声音',
      path: '/pages/recorder/index',
      imageUrl: '/static/img/share-img.png'
    }
  },
  onAddToFavorites() {
    return {
      title: '小程序实时解析声音',
      imageUrl: '/static/img/app-avatar.png'
    }
  },
  onShareTimeline() {
    return {
      title: '小程序实时解析声音',
      imageUrl: '/static/img/app-avatar.png'
    }
  }
})