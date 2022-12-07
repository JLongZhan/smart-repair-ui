<template>
  <div class="container">
    <van-nav-bar
        :title="$route.meta.title"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
    >
      <template #right>
        <van-icon name="scan" size="24" @click="scanQr"/>
      </template>
    </van-nav-bar>
    <div class="wrapper" id="publish">
      <van-field
          v-model="chooseExceptionType"
          is-link
          readonly
          left-icon="guide-o"
          label="异常分类"
          placeholder="请选择异常分类"
          @click="showExceptionScenes=true"
      />
      <van-popup v-model:show="showExceptionScenes" round position="bottom">
        <van-cascader
            v-model="exceptionTagsVal"
            title="请选择异常分类"
            :options="exceptionTags"
            @close="showExceptionScenes = false"
            @finish="onFinishTagChoose"
        />
      </van-popup>
      <!--紧急程度-->
      <van-field
          v-model="exception.chooseEmergencyVal"
          is-link
          left-icon="fire-o"
          readonly
          label="紧急程度"
          placeholder="请选择紧急程度"
          @click="showEmergencyDialog=true"
      />
      <van-action-sheet v-model:show="showEmergencyDialog" :actions="emergencyOptions" @select="_onEmergencyChoose"/>

      <van-field
          v-model="exception.location"
          clearable
          label="地点"
          left-icon="location-o"
          placeholder="请输入异常地点"
      />

      <van-field
          v-model="exception.datetime"
          center
          readonly
          left-icon="underway-o"
          input-align="right"
          @click="showDateChooseDialog=true"
          right-icon="arrow"
          label="异常时间">
      </van-field>
      <van-dialog v-model:show="showDateChooseDialog" title="选择异常时间" show-cancel-button>
        <van-datetime-picker
            :show-toolbar="false"
            v-model="currentDate"
            :formatter="datePickerFormatter"
        />
      </van-dialog>
      <!-- 推送人员 -->
      <van-field
          center
          autosize
          type="textarea"
          readonly
          left-icon="bullhorn-o"
          label="推送人员"
      >
        <template #input>
          <div class="tag-wrapper">
            <van-tag type="primary" plain round closeable size="medium" v-for="(item,idx) in selectWeiXinUserName"
                     @close="removeChoosePeople(idx)"
                     :key="item">
              {{ item }}
            </van-tag>
          </div>
        </template>
        <template #button>
          <van-button size="small" type="primary" icon="plus" plain @click="_selectPeople">选择人员</van-button>
        </template>
      </van-field>
      <!--    描述信息-->
      <van-field
          v-model="exception.exceptionDescription"
          rows="2"
          autosize
          left-icon="edit"
          label="异常描述"
          type="textarea"
          placeholder="请输入描述信息"
      />
      <!--    备注信息-->
      <van-field
          v-model="exception.remark"
          rows="2"
          autosize
          left-icon="comment-o"
          label="备注信息"
          type="textarea"
          maxlength="200"
          placeholder="请输入备注信息"
          show-word-limit
      />
      <!--    图片上传-->
      <van-uploader :after-read="afterUpload" v-model="uploadImgs" multiple/>

    </div>
    <div style="margin: 5px 16px;">
      <van-button round block type="primary" native-type="button" @click="_exceptionPush" :loading="submitLoading"
                  loading-text="提交中">提交
      </van-button>
    </div>
  </div>
</template>

<script>
const wx = require('work-weixin-js-sdk')
import {Toast} from 'vant';

export default {
  data() {
    return {
      submitLoading: false,
      currentDate: new Date(),
      showDateChooseDialog: false,
      showEmergencyDialog: false,
      chooseExceptionType: '',
      emergencyOptions: [{name: '一般紧急'}, {name: '紧急'}, {name: '特别紧急'}],
      exceptionTagsVal: '',
      exceptionTags: [],
      showExceptionScenes: false,
      allTags: {},
      exception: {
        chooseEmergencyVal: '',
        targetName: '',
        targetDescription: '',
        exceptionDescription: '',
        exceptionType: '',
        location: '',
        datetime: undefined,
        publisher: '',
        remark: '',
        fileList: []
      },
      uploadImgs: [],
      selectWeiXinUserId: [],
      selectWeiXinUserName: [],
    };
  },
  watch: {
    currentDate(item) {
      if (item) {
        this.exception.datetime = this.currentDate = this.formatterCurrentDateTime(item);
      }
    }
  },
  mounted() {
    let userid = sessionStorage.getItem("UserId");
    if (userid == null) {
      this.$toast("当前未登录")
    } else {
      this.exception.publisher = userid;
    }
  },
  created() {
    this._getWxJsJdk();
    this._getExceptionTags();
  },
  methods: {
    onClickLeft() {
      history.back();
    },
    /**
     * 移除已经选择通知的人
     * @param idx
     */
    removeChoosePeople(idx) {
      this.selectWeiXinUserId.splice(idx, 1);
      this.selectWeiXinUserName.splice(idx, 1);
    },
    /**
     * 格式化当前异常时间
     * @param date
     * @returns {string}
     */
    formatterCurrentDateTime(date) {
      date = new Date(date);
      var strDate = date.getFullYear() + "-";
      strDate += date.getMonth() + 1 + "-";
      strDate += date.getDate() + " ";
      let h = date.getHours();
      if (h >= 0 && h <= 9)
        h = '0' + h
      strDate += h + ":";

      let m = date.getMinutes();
      if (m >= 0 && m <= 9)
        m = '0' + m
      strDate += m;
      return strDate;
    },
    /**
     *  date-picker 控件 时间显示格式化
     * @param type
     * @param val
     * @returns {string|*}
     */
    datePickerFormatter(type, val) {
      if (type === 'month') {
        return `${val}月`;
      } else if (type === 'day') {
        return `${val}日`;
      } else if (type === 'hour') {
        return `${val}时`;
      } else if (type === 'minute') {
        return `${val}分`;
      }
      return val;
    },
    /**
     * 文件上传后回调
     */
    afterUpload(file) {
      let param = {
        "bucket": "smart-repair"
      }
      let formData = new FormData()
      formData.append('file', file.file)
      this.$api.Exception
          .uploadImage(formData, param)
          .then(res => {
            console.log(res);
            if (res.code === 0) {
              this.exception.fileList.push.apply(this.exception.fileList, res.data)
            }
          }).catch(err => {
        console.log(err);
      })
    },
    /**
     * 紧急 程度选择后回调
     * @param e
     * @private
     */
    _onEmergencyChoose(item) {
      this.showEmergencyDialog = false
      this.exception.chooseEmergencyVal = item.name;
    },
    /**
     * 异常类型选择结束后回调
     * @param e
     */
    onFinishTagChoose(e) {
      this.showExceptionScenes = false;
      console.log(e.selectedOptions.map((option) => option.text));
      let tags = e.selectedOptions.map((option) => option.text);
      this.exception.exceptionType = tags[0];
      this.exception.targetName = tags[1];
      this.exception.targetDescription = tags[2];
      this.chooseExceptionType = e.selectedOptions.map((option) => option.text).join(' / ');
    },
    /**
     * 获取异常标签
     * @private
     */
    _getExceptionTags() {
      let params = {
        scenes: '异常上报'
      }
      this.$api.Exception.getExceptionTags(params)
          .then(res => {
            console.log(res);
            if (res.code === 0) {
              this.allTags = res.data;
              this._changeTagDataFormat(res.data)
            }
          }).catch(err => {
        console.log(err);
      })
    },
    /**
     * 修改接口返回的异常标签数据格式，符合vant 组件要求
     * @param tags
     * @private
     */
    _changeTagDataFormat(tags) {
      let resultData = [];
      tags.forEach(item => {
        let scenesItem = {
          "text": item.typeName,
          "value": item.typeName,
        };
        let scenesChildren = [];
        scenesItem['children'] = scenesChildren;
        item.exceptionTags.forEach(tag => {
          let valItem = {
            "text": tag.valueName,
            "value": tag.valueName,
          };
          scenesChildren.push(valItem)
        })
        resultData.push(scenesItem)
      })
      this.exceptionTags = resultData;
    },
    /**
     * 异常推送
     * @private
     */
    _exceptionPush() {
      console.log(this.exception)
      if (this.selectWeiXinUserId.length === 0) {
        this.$toast("请选择推送人员");
        return;
      }
      if (
          this.exception.targetName === '' ||
          this.exception.targetDescription === '' ||
          this.exception.chooseEmergencyVal === '' ||
          this.exception.datetime === '' ||
          this.exception.exceptionDescription === '' ||
          this.exception.exceptionType === '' ||
          this.exception.location === '') {
        this.$toast("请完善信息后再提交");
        return;
      }
      let hq = sessionStorage.getItem("hq");
      let param =
          {
            "targetName": this.exception.targetName,
            "targetDescription": this.exception.targetDescription,
            "exceptionDescription": this.exception.exceptionDescription,
            "exceptionType": this.exception.exceptionType,
            "emergencyLevel": this.exception.chooseEmergencyVal,
            "remark": this.exception.remark,
            "location": this.exception.location,
            "occurDate": this.exception.datetime,
            "publisher": this.exception.publisher,
            "imgUrls": this.exception.fileList,
            "noticeObj": this.selectWeiXinUserId,
            "noticeObjNames": this.selectWeiXinUserName,
            "pushFrom": 1,
            "hq": "HQ" === hq
          };
      this.submitLoading = true;
      this.$api.Exception.exceptionPush(param)
          .then(res => {
            this.submitLoading = false;
            console.log(res)
            if (res.code === 0) {
              this.$toast("推送成功");
              this.exception = {
                chooseEmergencyVal: '',
                targetName: '',
                targetDescription: '',
                exceptionDescription: '',
                exceptionType: '',
                location: '',
                datetime: undefined,
                publisher: '',
                remark: '',
                fileList: []
              }
              this.$router.replace({name: 'Exception'})
            } else {
              this.$toast("推送失败" + res.message)
            }
          }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 选择推送人员
     * @private
     */
    _selectPeople() {
      wx.invoke('selectEnterpriseContact', {
            "fromDepartmentId": -1,// 必填，表示打开的通讯录从指定的部门开始展示，-1表示自己所在部门开始, 0表示从最上层开始
            "mode": "multi",// 必填，选择模式，single表示单选，multi表示多选
            "type": ["department", "user"],// 必填，选择限制类型，指定department、user中的一个或者多个
            "selectedDepartmentIds": [],// 非必填，已选部门ID列表。用于多次选人时可重入，single模式下请勿填入多个id
            "selectedUserIds": []// 非必填，已选用户ID列表。用于多次选人时可重入，single模式下请勿填入多个id
          }, (res => {
            if (res.err_msg === "selectEnterpriseContact:ok") {
              if (typeof res.result == 'string') {
                res.result = JSON.parse(res.result) //由于目前各个终端尚未完全兼容，需要开发者额外判断result类型以保证在各个终端的兼容性
              }
              /*
                            let selectedDepartmentList = res.result.departmentList;// 已选的部门列表
                            for (let i = 0; i < selectedDepartmentList.length; i++) {
                              let department = selectedDepartmentList[i];
                              let departmentId = department.id;// 已选的单个部门ID
                              let departemntName = department.name;// 已选的单个部门名称
              }*/
              let selectedUserList = res.result.userList; // 已选的成员列表

              for (let i = 0; i < selectedUserList.length; i++) {
                let user = selectedUserList[i];
                console.log(user)
                if (this.selectWeiXinUserId.indexOf(user.id) === -1) {
                  this.selectWeiXinUserId.push(user.id)
                  this.selectWeiXinUserName.push(user.name)
                }
                // let userAvatar = user.avatar;// 已选的单个成员头像
              }
            }
          })
      );
    },

    /**
     * 微信扫一扫
     */
    scanQr() {
      wx.scanQRCode({
        desc: 'scanQRCode desc',
        needResult: 0, // 默认为0，扫描结果由企业微信处理，1则直接返回扫描结果，
        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是条形码（一维码），默认二者都有
        success: function (res) {
          // 回调
          // var result = res.resultStr;//当needResult为1时返回处理结果
          alert(res)
        },
        error: function (res) {
          if (res.errMsg.indexOf('function_not_exist') > 0) {
            alert('版本过低请升级')
          }
        }
      });

    },
    /**
     * 微信Sdk初始化配置
     * @private
     */
    _getWxJsJdk() {
      let isHq = sessionStorage.getItem("hq") === "HQ";
      this.$api.Exception.getSignature(
          {
            url: location.href.split('#')[0],
            hq: isHq
          })
          .then(res => {
            if (res.code === 0) {
              this.signature = res.data.signature;
              this.appId = res.data.appId;
              this.noncestr = res.data.nonceStr;
              this.timestamp = res.data.timestamp;
              console.log("签名：", this.signature, this.appId, this.noncestr, this.timestamp)
              wx.config({
                beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: this.appId, // 必填，企业微信的corpID
                timestamp: this.timestamp, // 必填，生成签名的时间戳
                nonceStr: this.noncestr, // 必填，生成签名的随机串
                signature: this.signature,// 必填，签名，见附录1
                jsApiList: ['checkJsApi', 'selectEnterpriseContact', 'openUserProfile', 'hideOptionMenu', 'scanQRCode'] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
              });
              wx.ready(() => {
                console.log('成功')
              });
              wx.error(function (res) {//通过error接口处理失败验证
                // config信息验证失败会执行error
                console.log('执行失败', res);
              });
            } else {
              console.log("res。daata", res.data)
            }
          }).catch(err => {
        console.log(err);
      })
    },
  }
};
</script>

<style lang="less">
.wrapper {
  overflow: hidden;
  padding: 0 14px;
}

.van-uploader__upload {
  margin-top: 5px;
  border: 1px solid #e8e8e8;
  background-color: white;
}

.van-uploader__upload .van-icon {
  color: #323232;
}

.van-tag {
  margin-left: 2px;
}


.target-wrapper label {
  color: #646566 !important;
}

.van-field__left-icon .van-badge__wrapper {
  font-size: 18px;
  margin-right: 3px;
  color: #1989fa;
}

.overlay-wrapper {
  width: 100%;
  position: absolute;
  bottom: 40%;
}
</style>
