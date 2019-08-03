// pages/mymovie/mymovie.js
const db=wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    movies:[] //
  },
  // 函数
  loadComment(){
    db.collection("comment").get().then(res => {
       //console.log(res);
      this.setData({
        list: res.data
      });
      // 根据list存放的id去查询对应的电影信息
      for (var i = 0; i < this.data.list.length; i++) {
        var movieid = this.data.list[i].movieid;
        wx.cloud.callFunction({
          name: "getdetail",
          data: {
            id: movieid //传递来的id存在movieid里
          }
        }).then(res => {
          // 将返回结果保存
          // console.log(res);
          var m = JSON.parse(res.result);
          var newMovies = this.data.movies.concat(m);
          this.setData({
            movies: newMovies
          });
        }).catch(err => {
        });
      }
    }).catch(err => {
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadComment();
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
    this.loadComment();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})