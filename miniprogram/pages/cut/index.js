const { windowWidth } = wx.getSystemInfoSync();
const ratio = windowWidth / 750;

const page = {
  data: {
    // 可自行设置裁剪框大小
    sizeW: 420, // 裁剪框大小，sizeH、sizeW中较小的值同时也是最小边的长度
    sizeH: 420,
    // 以下均于onLoad中计算得出
    height: 0, // 图片大小
    width: 0,
    direction: true, // true为横向，false为竖向
    top: 50, // 图片位置（会因拖动而改变）
    left: 0,
    sTop: 50, // 裁剪框位置（一定下来就不变， 同时也是图片的原始位置）
    sLeft: 0,
  },
  onLoad(e) {
    const { img } = e;
    wx.getImageInfo({
      src: img,
      success: (res) => {
        const { sizeW, sizeH } = this.data;
        const { width, height, path } = res;
        const direction = width > height;
        const w = direction ? width * sizeW / height : sizeW;
        const h = direction ? sizeH : height * sizeH / width;
        const left = (windowWidth - sizeW * ratio) / 2;
        this.setData({ width: w, height: h, direction, left, sLeft: left, img: path });
      }
    })
  },
  touchstart(e) {
    const { pageX, pageY } = e.touches[0];
    this.startX = pageX;
    this.startY = pageY;
  },
  touchmove(e) {
    const { direction } = this.data;
    let { left, top, height, width, sTop, sLeft, sizeW, sizeH } = this.data;
    const { startX, startY } = this;
    const { pageX, pageY } = e.touches[0];
    // 移动变量
    const moveX = direction ? pageX - startX : 0;
    const moveY = direction ? 0 : pageY - startY;
    // 移动
    left += moveX;
    top += moveY;
    // 边界处理
    if (top > sTop) {
      top = sTop;
    } else if (top < sizeH * ratio + sTop - height * ratio) {
      top = sizeH * ratio + sTop - height * ratio;
    }
    if (left > sLeft) {
      left = sLeft;
    } else if (left < sizeW * ratio + sLeft - width * ratio) {
      left = sizeW * ratio + sLeft - width * ratio;
    }
    // 重置起始点
    this.startX = pageX;
    this.startY = pageY;
    // 跑起来
    this.setData({ left, top });
  },
  click() {
    const { img, height, top, left, width, sTop, sLeft, direction, sizeW, sizeH } = this.data;
    const ctx = wx.createCanvasContext('canvas');
    ctx.drawImage(img, 0, 0, width * ratio, height * ratio);
    ctx.draw(false, () => {
      wx.canvasToTempFilePath({
        canvasId: 'canvas',
        x: direction ? sLeft - left : 0,
        y: direction ? 0 : sTop - top,
        width: sizeW * ratio,
        height: sizeH * ratio,
        success: (res) => {
          // 最终裁剪得出的图片
          console.log(res.tempFilePath);
          wx.setStorageSync('img', res.tempFilePath);
          wx.navigateBack();
        }
      })
    })
  },
  back() {
    this.setData({ showPic: false });
  }
}

Page(page);