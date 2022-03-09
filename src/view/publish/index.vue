<template>
  <div class="wrapper" id="publish">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
            v-model="exception.target"
            name="异常对象"
            label="异常对象"
            required
            placeholder="异常对象"
            :rules="[{ required: true, message: '请填写异常对象' }]"
        />
        <van-field
            v-model="exception.description"
            name="异常描述"
            required
            label="异常描述"
            placeholder="异常描述"
            :rules="[{ required: true, message: '请填写异常描述' }]"
        />
        <van-field
            v-model="exception.location"
            name="异常地点"
            label="异常地点"
            placeholder="异常地点"
            required
            :rules="[{ required: true, message: '请填写异常地点' }]"
        />
        <van-field
            v-model="exception.datetime"
            is-link
            readonly
            name="calendar"
            label="异常时间"
            placeholder="点击选择时间"
            @click="showCalendar = true"
        />
        <van-overlay :show="showCalendar" @click="showCalendar = false">
          <van-datetime-picker type="datetime"

                               class="overlay-wrapper"
                               :min-date="minDate"
                               @cancel="showCalendar = false"
                               @confirm="_onDateConfirmChoose"/>
        </van-overlay>
        <van-field
            class="target-wrapper"
            clearable
            label="推送对象"
            v-model="choosePeople"
            :rules="[{ required: true, message: '请选择推送对象' }]"
        >
          <template #button>
            <van-button icon="plus" type="primary" plain hairline @click="_selectPeople">
              选择推送人员
            </van-button>
          </template>
        </van-field>
      </van-cell-group>

      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit" @click="_exceptionPush">
          立即推送
        </van-button>
        `
      </div>
    </van-form>
  </div>
</template>

<script>
// import { Checkbox, CheckboxGroup, Card, SubmitBar, Toast } from 'vant';
const wx = require('work-weixin-js-sdk')

export default {
  data() {
    return {
      currentDate: undefined,
      exception: {
        target: '',
        description: '',
        location: '',
        datetime: '',
        publisher: '',
      },
      minDate: new Date(2022, 2, 1),
      showCalendar: false,
      selectWeiXinUser: [],
      selectWeiXinUserId: [],
      selectWeiXinUserName: [],
      choosePeople: '',
    };
  },
  computed: {},
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
  },
  methods: {
    _onDateConfirmChoose(val) {
      console.log(val);
      // this.exception.date = `${1900 + val.getYear()}-${val.getMonth() + 1}-${val.getDate()}`;
      let h = val.getHours();
      if (h >= 0 && h <= 9)
        h = '0' + h

      let m = val.getMinutes();
      if (m >= 0 && m <= 9)
        m = '0' + m
      this.exception.datetime = `${1900 + val.getYear()}-${val.getMonth() + 1}-${val.getDate()} ${h}:${m}`;
      this.showCalendar = false;
      console.log("_onDateConfirmChoose", this.exception.datetime)
    },

    onSubmit() {
      console.log("提交")
    },
    _exceptionPush() {
      if (this.selectWeiXinUser.length === 0) {
        this.$toast("请选择推送人员");
        return;
      }
      if (this.exception.target === '' ||
          this.exception.datetime === ''
          || this.exception.description === '' || this.exception.location === '') {
        this.$toast("请输入完信息在提交");
        return;
      }

      let param =
          {
            "targetName": this.exception.target,
            "targetDescription": this.exception.description,
            "location": this.exception.location,
            "occurDate": this.exception.datetime,
            "publisher": this.exception.publisher,
            "noticeObj": this.selectWeiXinUserId,
            "noticeObjNames": this.selectWeiXinUserName,
            "pushFrom": 1
          };
      console.log(param)
      this.$api.Exception.exceptionPush(param)
          .then(res => {
            console.log(res)
            if (res.code === 0) {
              this.$toast("推送成功");
              this.exception = {
                target: '',
                description: '',
                location: '',
                date: '',
                time: '',
                publisher: '',
              };
              this.choosePeople = ''
            } else {
              this.$toast("推送失败" + res.message)
            }
          }).catch(err => {
        console.log(err)
      })
    },
    _selectPeople() {
      this.choosePeople = '';
      this.selectWeiXinUser = [];
      this.selectWeiXinUserId = [];
      this.selectWeiXinUserName = [];
      wx.invoke('selectEnterpriseContact', {
            "fromDepartmentId": -1,// 必填，表示打开的通讯录从指定的部门开始展示，-1表示自己所在部门开始, 0表示从最上层开始
            "mode": "multi",// 必填，选择模式，single表示单选，multi表示多选
            "type": ["department", "user"],// 必填，选择限制类型，指定department、user中的一个或者多个
            "selectedDepartmentIds": [],// 非必填，已选部门ID列表。用于多次选人时可重入，single模式下请勿填入多个id
            "selectedUserIds": []// 非必填，已选用户ID列表。用于多次选人时可重入，single模式下请勿填入多个id
          }, (res => {
            console.log('失败', res)
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
              this.selectWeiXinUser = res.result.userList;

              for (let i = 0; i < selectedUserList.length; i++) {
                let user = selectedUserList[i];
                console.log(user)
                this.selectWeiXinUserId.push(user.id)
                this.selectWeiXinUserName.push(user.name)
                // let userAvatar = user.avatar;// 已选的单个成员头像
              }
              if (this.selectWeiXinUserName.length > 0) {
                this.choosePeople = this.selectWeiXinUserName.join(",")
              }
            }
          })
      );
    },
    /**
     * 微信Sdk初始化配置
     * @private
     */
    _getWxJsJdk() {
      this.$api.Exception.getSignature(
          {url: location.href.split('#')[0]})
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
                jsApiList: ['checkJsApi', 'selectEnterpriseContact', 'openUserProfile', 'hideOptionMenu'] // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
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
}

.target-wrapper label {
  color: #646566 !important;
}

.overlay-wrapper {
  width: 100%;
  position: absolute;
  bottom: 40%;
}
</style>
