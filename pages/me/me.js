// pages/me/me.js
const db = wx.cloud.database(); //初始化
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [] //保存数据
  },
  //-函数-----------------------
  showPic() {
    //此函数查询myphoto集合中图片的img_url
    db.collection("myphoto").get().then(res => {
      var list = res.data;
      console.log(list);
      this.setData({
        list: list //保存到list
      })
    }).catch(err => {

    });
  },
  myupload() {
    //选中图片并且上传至云存储
    //上传成功后将fileID保存到集合myphoto
    wx.chooseImage({ //1. 选择一张图
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: function (res) {
        console.log("选择成功", res);
        var file = res.tempFilePaths[0];
        var str = file.slice(-4);
        var newFile = new Date().getTime() + str;
        //2. 选择后上传至云存储
        wx.cloud.uploadFile({
          //上传成功后将fileID保存到集合myphoto
          cloudPath: newFile, //新名字
          filePath: file, //旧名字
          success: res => { //上传成功
            console.log("上传成功", res);
            var fileID = res.fileID; //文件云地址
            //3. 保存到集合
            db.collection("myphoto").add({
              data: { img_url: fileID },
              success: res => { //保存成功
                console.log("添加成功", res);
                this.showPic();
              },
              fail: err => { //保存失败
                console.log(err);
              }
            });
          }
        });
      },
      fail: function (err) { //选择失败
        console.log(err);
      }
    })
  },
  //---------------------------
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.showPic();
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

  }
})