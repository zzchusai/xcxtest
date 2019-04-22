// pages/phoneLogin/phoneLogin.js
const app=getApp();
const net=require('../../utils/http.js');
const account=require('../../utils/account.js');
const regTel=/^1[3,4,5,8,9][0-9]{9}$/;  //手机号正则
const regCode=/^\d{6}$/;  //验证码正则
let timer=null;
let count=10;
let cangetcode=true;  //可以点击获取验证码，多次点击会导致反复获取验证码
Page({

  /**
   * 页面的初始数据
   */
  data: {
    txtTel:"",
    canSubmit:false,
    codeTxt:"获取验证码",
    txtCode:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    clearInterval(timer);
    timer=null;
    count=10;
    cangetcode=true;
  },
  checkTel(isTel){
    let _this=this;
    let txtTel=_this.data.txtTel;
    if(txtTel.length<11){
      return false;
    }
    if(txtTel&&regTel.test(txtTel)){
      return true;
    }
    if(isTel){
    wx.showToast({
      title: '请输入正确的手机号',
      icon:'none'
    })
    }
    return false;
  },
  checkCode(isCode){
    let _this=this;
    let txtCode=_this.data.txtCode;
    if(txtCode.length<6){
      return false;
    }
    if(txtCode&&regCode.test(txtCode)){
      return true;
    }
    if(isCode){
    wx.showToast({
      title: '请输入正确的验证码',
      icon:'none'
    })
    }
    return false;
  },
  checkSubmit(isSubmit){
    let _this=this;
    if(_this.checkTel(isSubmit)&&_this.checkCode(isSubmit)){
      _this.setData({canSubmit:true})
      return true;
    }else{
      _this.setData({canSubmit:false});
      return false;
    }
  },
  inputTel(e){
    let _this=this;
    console.log(e.detail.value)
    _this.setData({txtTel:e.detail.value});
    _this.checkSubmit(false);
  },
  //清除手机号码
  clearTel(){
    let _this=this;
    _this.setData({txtTel:""})
  },
  inputCode(e){
    let _this=this;
    _this.setData({txtCode:e.detail.value})
    _this.checkSubmit(false)
  },
  clearCode(){
    let _this=this;
    _this.setData({txtCode:""})
  },
  getCode(){
    let _this=this;
    if(_this.checkTel(true)&&cangetcode){
      if(count<10){
        return;
      }
      cangetcode=false;
    net.http({
      url:"getcode",
      method:"get",
      parameter:{
        phone:_this.data.txtTel
      },
      fuSuccess(res){
        timer=setInterval(function(){
          if(count<1){
            clearInterval(timer)
            timer=null;
            count=10;
            _this.setData({codeTxt:"获取验证码"})
          }else{
            count-=1;
            _this.setData({codeTxt:count+"s后重发"})
          }
        },1000)
        wx.showToast({
          title: '已发送',
          icon:'none'
        })
      },
      fuFail(res){
        wx.showToast({
          title: '验证码出现问题',
          icon:"none"
        })
      },
      complete(){
        cangetcode=true;
      }
    })
    }
  },
  toLogin(){
    let _this=this;
    let txtTel=_this.data.txtTel;
    let txtCode=_this.data.txtCode;
    if(txtTel.length<11&&txtCode.length<6){
      return;
    }
    if(_this.checkSubmit(true)){
      net.http({
        url:"getphone",
        method:"get",
        parameter:{app_ver:"2.4.1",phone:txtTel,code:txtCode},
        fuSuccess(res){
          if(res.data.data.status==1){
          let userInfo=res.data.data;
          app.globalData.phone=txtTel;
          app.globalData.token=res.data.data.token;
          app.globalData.userInfo=userInfo;
          wx.setStorageSync("phone", txtTel);
          wx.setStorageSync("userInfo", userInfo);
          wx.setStorageSync("token", res.data.data.token);
          wx.navigateBack({
          })
          }else if(res.data.data.status==0){
            wx.showToast({
              title: res.data.data.msg,
              icon:"none"
            })
          }
        }
      })
    }
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
    clearInterval(timer);
    timer=null;
    count=10;
    cangetcode=true;
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