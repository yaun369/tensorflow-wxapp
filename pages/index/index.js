// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modelsList: [{
      url: '/pages/posenet/index',
      logo: '/static/img/posenet.png',
      title: '姿势估计',
      desc: '实时估计人体姿势 (PoseNet)。'
    }, {
      url: '/pages/coco-ssd/index',
      logo: '/static/img/coco-ssd.png',
      title: '对象检测',
      desc: '定位和识别单个图像中的多个对象 (Coco SSD)。'
    }, {
      url: '/pages/recorder/index',
      logo: '/static/img/recorder.png',
      title: '实时解析声音',
        desc: '利用小程序录音API，实时解析PCM格式的声音，并转换成音量大小的百分比。这个转换结果并不是具体分贝。'
    }]
  },

  handleClickItem(e) {
    let { url } = e.currentTarget.dataset;
    wx.navigateTo({ url });
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
      title: 'TensorFlow遇上小程序',
      path: '/pages/index/index',
      imageUrl: '/static/img/share-img.png'
    }
  },
  onAddToFavorites() {
    return {
      title: 'TensorFlow遇上小程序',
      imageUrl: '/static/img/app-avatar.png'
    }
  },
  onShareTimeline() {
    return {
      title: 'TensorFlow遇上小程序',
      imageUrl: '/static/img/app-avatar.png'
    }
  }
})