// pages/home/home.js
import Toast from 'vant-weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [] //
  },
  // 函数
  jumpComment(e) {
    //用户点击详情按钮 跳转到详情组件comment
    // wx.redirectTo({url:'/pages/comment/comment'}); //无返回
    var id = e.target.dataset.id;
    // console.log(id);
    var toUrl = `/pages/comment/comment?id=${id}`;
    wx.navigateTo({ url: toUrl }); //可以返回
  },
  loadMore(){
    //调用云函数获取电影列表
    wx.cloud.callFunction({
      name: "getmovielist",
      data: {
        start:0,
        count:30
      }
    }).then(res => {
      // console.log(res); //查看结果json
      var obj= JSON.parse(res.result); //解析
      //保存电影列表
      this.setData({
        list: obj.subjects //保存到list
      });
    }).catch(err => {
      console.log(err);
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadMore(); //调用
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
    Toast('想看更多,请前往电影列表页'); //文字提示
    // <van-toast id="van-toast" />
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})