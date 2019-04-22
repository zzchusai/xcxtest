// pages/components/homeBanner/homeBanner.js
const app=getApp();
const net=require('../../../utils/http.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bannerData:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    bannerData:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
  }
})
