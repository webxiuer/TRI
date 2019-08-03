// pages/comment/comment.js
import Toast from 'vant-weapp/toast/toast';
const db=wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fileIDs: [], //保存图片的id
    images: [], //存图
    movieid: 0, //保存电影id
    detail: {}, //保存电影信息
    value_field: "", //van-field 用户输入内容
    value_rate: "5" //van-rate 评分
  },
  // 函数
  selectImage(){ //预览图片
    wx.chooseImage({ //选择图片
      count: 9, //一次选择几张图片 默认9
      sizeType: ["original", "compressed"], //选中图片的类型(原图/压缩图)
      sourceType: ["album", "camera"], //图片的来源(相册/相机)
      success: res => { //使用箭头函数保持this一致
        // console.log(res.tempFilePaths); //选中图片的地址
        this.setData({
          images: res.tempFilePaths //
        });
      }
    })
  },
  // 提交评论函数
  mysubmit(){ 
    //将选中的图片上传到云存储, 将fileID一次性保存到云数据库
    //1.提前准备fileIDs: []
    if (this.data.value_field.length==0){
      Toast.fail('评论是空的哦~~~');
      return;
    }else{
      //2.显示加载动画 "正在提交..."
      wx.showLoading({
        title: '正在提交...',
      })
      //3.上传到云存储
      //3.1 创建promise数组
      var promiseArr = [];
      //3.2 创建循环遍历选中的图片
      for (var img of this.data.images) {
        //3.3 创建promise对象
        promiseArr.push(
          new Promise((resolve, reject) => {
            //3.3.1 创建正则表达式拆分文件后缀名 .jpg .gif
            var suffix = /\.\w+$/.exec(img)[0];
            //3.3.2 上传图片并且将fileID保存到数组里
            var newImg = new Date().getTime() + Math.floor(Math.random() * 9999) + suffix;
            //新文件名(时间戳+随机数+后缀名 不重复)
            wx.cloud.uploadFile({
              //3.3.3 为图片创建新的文件名
              cloudPath: newImg, //上传成功后新文件名
              filePath: img, //选中图片名(选择时存在数组里的那个)
              success: res => { //上传成功后
                //3.3.4 上传成功后 更新fileID
                var fid = res.fileID;
                var ids = this.data.fileIDs.concat(fid);
                this.setData({ fileIDs: ids }); //直接设置会替换
                //3.3.5 将当前promise任务追加到任务列表
                resolve();
              },
              //3.3.7 上传失败 输出err
              fail: err => { console.log(err); }
            });
          })); //promise end
      } //for end
      //4.数据库添加 集合comment(记得page上面初始化数据库db)
      //5.等待数组中所有promise执行结束
      Promise.all(promiseArr).then(res => { //6.回调函数
        //7.将评论的内容 分数 电影id 上传图片所有的id 添加到集合中
        db.collection("comment").add({
          data: {
            content: this.data.value_field, //评论内容
            score: this.data.value_rate, //打分
            movieid: this.data.movieid, //电影id
            fileIDs: this.data.fileIDs  //上传的图片fileID
          }
        }).then(res => {
          //8.隐藏加载提示框
          wx.hideLoading();
          //9.显示提示框 "发表成功"
          wx.showToast({ title: '发表成功' });
          wx.redirectTo({ url: '/pages/list/list' });
        }).catch(err => {
          //10.添加失败
          //11.隐藏加载提示框
          wx.hideLoading();
          //12.显示提示框 "评论失败"
          wx.showToast({ title: '发表失败' })
        });
      }); 
    }   
  },
  //当组件加载成功后显示电影详细信息
  loadMore(){
    wx.showLoading({ //加载前的提示
      title: '加载中...',
    })
    //调用云函数getdetail 参数id 返回值保存到detail
    wx.cloud.callFunction({
      name: "getdetail",
      data: {
        id: this.data.movieid //传递来的id存在movieid里
      }
    }).then(res=>{
      // console.log(res);
      // 将返回结果保存
      var movie=JSON.parse(res.result); //解析
      this.setData({
        detail: movie, //保存到detail
        //----------------------------------------
        value_rate: movie.rating.average //默认评分
      });
      wx.hideLoading(); //结束提示
    }).catch(err=>{});
  },
  onRateChange(e){ //rate事件
    this.setData({
      value_rate: e.detail //更改分值
    });
  },
  onFieldChange(e) { //field事件
    // e.detail 用户输入的值
    this.setData({
      value_field: e.detail //评论内容
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { //options接收参数
    //打印传递来的id
    // console.log(options.id);
    this.setData({
      movieid: options.id //存到movieid
    });
    this.loadMore();
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