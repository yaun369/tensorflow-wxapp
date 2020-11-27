// pages/index/index.js
const tf = require('@tensorflow/tfjs-core');
const posenet = require('@tensorflow-models/posenet');
const regeneratorRuntime = require('regenerator-runtime');
import {
  drawKeypoints,
  drawSkeleton
} from './utils';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    devicePosition: 'front'
  },
  handleSwitchCamera() {
    let devicePosition = this.data.devicePosition === 'front' ? 'back' : 'front';
    this.setData({
      devicePosition
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onCameraError(err) {
    console.log('onCameraError>>', err);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    const context = wx.createCameraContext();
    this.poseCanvans = wx.createCanvasContext('pose', this);
    this.loadPosenet();
    let count = 0;
    const listener = context.onCameraFrame((frame) => {
      count++;
      if (count === 4) {
        if (this.net) {
          this.drawPose(frame); // 绘制模型返回的点
        }
        count = 0;
      }
    });
    listener.start();
  },

  /**
   * 加载模型
   */
  async loadPosenet() {
    this.net = await posenet.load({
      architecture: 'MobileNetV1',
      outputStride: 16,
      inputResolution: 193,
      multiplier: 0.5,
      modelUrl: 'https://star-1257061493.cos.ap-beijing.myqcloud.com/tensorflow/model-stride16.json'
    });
  },

  /**
   * 检测模型
   * @param {图像数据} frame 
   * @param {模型网络} net 
   */
  async detectPose(frame, net) {
    const imgData = {
      data: new Uint8Array(frame.data),
      width: frame.width,
      height: frame.height
    };
    const imgSlice = tf.tidy(() => {
      const imgTenser = tf.browser.fromPixels(imgData, 4);
      return imgTenser.slice([0, 0, 0], [-1, -1, 3]);
    });
    const pose = await net.estimateSinglePose(imgSlice, {
      flipHorizontal: false
    });
    imgSlice.dispose();
    return pose;
  },

  async drawPose(frame) {
    let pose = await this.detectPose(frame, this.net); // 获取到模型预测的点
    if (pose == null && this.poseCanvans == null) return;
    console.log(pose)
    const minPoseConfidence = 0.2;
    const minPartConfidence = 0.3;
    if (pose.score >= minPoseConfidence) {
      drawKeypoints(pose.keypoints, minPartConfidence, this.poseCanvans)
      drawSkeleton(pose.keypoints, minPartConfidence, this.poseCanvans)
    }
    this.poseCanvans.draw()
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

  }
})