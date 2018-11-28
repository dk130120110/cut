//index.js
const app = getApp()

Page({
  data: {
    img: '',
  },
  onShow() {
    const img = wx.getStorageSync('img') || null;
    this.setData({ img });
  },
  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        const filePath = res.tempFilePaths[0]
        wx.navigateTo({ url: `../cut/index?img=${filePath}` })
      },
      fail: e => {
        console.error(e)
      }
    })
  },
})
