// pages/profile/profile.js
const app=getApp();  //获取全局对象
const net=require('../../utils/http.js');
const account=require('../../utils/account.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin:false,
    userInfo:{},
    phone:"",
  },
  //点击登录
  toLogin(){
    let _this=this;
    if(_this.data.isLogin){
      return;
    }
    account.getUser(function(res,avatarImgUrl){
      console.log(res.data,avatarImgUrl);
      let user=res.data;
      user.avatar=avatarImgUrl;
      app.globalData.userInfo=user;
      app.globalData.token=res.data.token;
      app.globalData.phone=res.data.phone;
      wx.setStorageSync("username", res.data.username);
      wx.setStorageSync("token", res.data.token);
      wx.setStorageSync("userInfo",user);
      wx.setStorageSync('phone', res.data.phone)
      _this.setData({isLogin:true,userInfo:user,phone:res.data.phone})
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this=this;
    // wx.getStorageSync(key)
    let token=wx.getStorageSync("token");
    let phone=wx.getStorageSync("phone");
    let user=wx.getStorageSync("userInfo")
    console.log(phone)
    if(token!=''){
      _this.setData({isLogin:true,userInfo:user,phone:phone})
    }else{
      _this.setData({ isLogin: false, userInfo:{}, phone: "" })
    }
    if(_this.data.isLogin){
      //Synchronization information:同步信息
      _this.syncInfo()
    }
  },
  syncInfo(){
    let _this=this;
    net.http({
      url:"login",
      method:"get",
      parameter:{
        username:"zzc",
        password:"123456"
      },
      fuSucess(res){
          console.log(res)
          app.globalData.token=res.data.token;
          app.globalData.userInfo=res.data;
          app.globalData.phone=res.data.phone;
          _this.setData({isLogin:true,phone:res.data.phone,userInfo:res.data})
      }
    })
  },
  toPhoneLogin(){
    wx.navigateTo({
      url: '../phoneLogin/phoneLogin',
    });
  },
  loginOut(){
    let _this=this;
    app.globalData.token="";
    app.globalData.phone="";
    app.globalData.userInfo=null;
    wx.removeStorageSync("userInfo");
    wx.removeStorageSync("username");
    wx.removeStorageSync("phone");
    wx.removeStorageSync("token");
    _this.onShow();
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