// components/app-van/index.js
Component({
  options: {
    styleIsolation: 'shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleToHome() {
      let length = getCurrentPages().length;
      if (length > 1) {
        wx.navigateBack();
      } else {
        wx.redirectTo({ url: `/pages/index/index` });
      }
    }
  }
})
