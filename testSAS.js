// miniprogram/pages/testSAS/testSAS.js
const db = wx.cloud.database()
const qnaire = require("./sas.js")
var ans = new Array(20)
Page({
  data: {
    qnaire: qnaire.qnaire,
    answer: ans,
    id: 0
  },

  radioChange: function (e) {
    console.log(e.detail.value)
  },

  nextq: function () {
    if (this.data.id < 19) {
      this.setData({
        id: this.data.id + 1,
      })
    }
  },

  lastq: function (e) {
    if (this.data.id != 0) {
      this.setData({
        id: this.data.id - 1,
      })
    }
  },

  submit: function (e) {
    console.log(e.detail.value);
    var a = e.detail.value.answer;
    var id = this.data.id;
    ans[id] = a;
    this.setData({
      answer: ans,
    })
    console.log(this.data.answer);
    
  },

  formSubmit: function() {
    var finish;
    var i = 0;
    var _this = this;
    while(i<20) {
      if(ans[i]=="") {
        finish='false';
        break;
      } else {
        finish='true';
      }
      i++;
    }
    if(finish=='false') {
      wx.showModal({
        title: '无法提交',
        content: '您还有部分题目未完成，请检查后重新提交',
        showCancel: false,
        confirmColor: '#fcbe39',
        confirmText: "好的",
        success (res) {
          _this.setData({
            id: i,
          })
        }
      })
    } else{
      wx.showLoading({
        title: '加载中',
      })
      setTimeout(function () {
        wx.hideLoading({
          success (res) {
            _this.answer2db();
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }, 2000)
    }
  },

  answer2db: function() {
    db.collection('SAS').add({
      data: {
        answer: this.data.answer
      },
      success (res) {
        console.log(res._id);
      },
      fail (res) {
        wx.showToast({
          icon: 'none',
          title: '新增记录失败'
        })
        console.error('[数据库] [新增记录] 失败：', err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    for(var i=0; i<20; i++) {
      ans[i] = "A";
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