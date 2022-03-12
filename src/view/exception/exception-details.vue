<template>
  <div>
    <router-view></router-view>
    <div class="details-wrapper" v-if="$route.meta.index===1">

      <van-nav-bar
          title="异常详情"
          left-text="返回"
          left-arrow
          @click-left="onClickLeft"
      />
      <van-form class="form-wrapper">
        <van-cell-group inset>
          <van-field
              v-model="exception.targetName"
              name="异常对象"
              label="异常对象"
              disabled
          />
          <van-field
              v-model="exception.exceptionDescription"
              name="异常描述"
              label="异常描述"
              disabled
          />
          <van-field
              v-model="exception.location"
              name="异常发生地点"
              label="异常发生地点"
              disabled
          />
          <van-field
              v-model="exception.noticeObjs"
              name="通知对象"
              label="通知对象"
              disabled
          />
          <van-field
              v-model="exception.occurTime"
              name="异常发生时间"
              label="异常发生时间"
              disabled
          />

          <van-field
              v-model="exception.remark"
              name="异常备注"
              label="异常备注"
              disabled
          />

          <van-field
              v-model="exception.state"
              name="异常状态"
              label="异常状态"
              right-icon="warning-o"
              disabled
          >
          </van-field>

        </van-cell-group>
        <van-cell-group inset v-if="exception.processInfo !=null">
          <van-field
              v-model="exception.processInfo.handlerName"
              name="异常处理人员"
              label="异常处理人员"
              disabled
          />
          <van-field
              v-model="exception.processInfo.cause"
              name="异常发生原因"
              label="异常发生原因"
              disabled
          />
          <van-field
              v-if="exception.processInfo.normVal"
              v-model="exception.processInfo.normVal"
              name="异常影响指标"
              label="异常影响指标"
              disabled
          />
          <van-field
              v-model="exception.processInfo.countermeasure"
              name="异常处理对策"
              label="异常处理对策"
              disabled
          />

          <van-field
              v-if="exception.processInfo.completeTime"
              v-model="exception.processInfo.completeTime"
              name="异常完成时间"
              label="异常完成时间"
              disabled
          />
        </van-cell-group>

      </van-form>
      <div style="margin: 16px;">
        <van-button round block :type="exception.currentState===2?'success':'primary'" @click="_processException"
                    :disabled="exception.currentState!==0">
          {{ processStateText[exception.currentState] }}
        </van-button>
        <van-button style="margin-top: 40px" round block type="primary" v-if="showCompleteButton"
                    v-show="exception.currentState!==2"
                    @click="_completeException">
          填写处理反馈
        </van-button>
      </div>
    </div>
  </div>

</template>

<script>

export default {
  name: "exception",
  data() {
    return {
      userId: undefined,
      currentId: undefined,
      processStateText: {
        0: '我能处理该异常',
        1: '处理中',
        2: '已完成'
      },
      showCompleteButton: false,
      exception: {
        targetName: "",
        targetDescription: "",
        exceptionDescription: '',
        location: "",
        bindLine: "",
        occurTime: "",
        currentState: 0,
        processInfo: {
          id: undefined,
          cause: null,
          countermeasure: null,
          handlerName: "",
          completeTime: "",
          remark: "",
        }
      },
    }
  },
  methods: {
    /**
     * 获取异常详情
     * @param exceptionId
     * @private
     */
    _getExceptionDetails(exceptionId) {
      this.$api.Exception.exceptionDetail(exceptionId)
          .then(res => {
            if (res.code === 0) {
              this.exception = res.data;
              this.exception.targetName += (" - " + this.exception.targetDescription)
              this.exception.location += " " + this.exception.bindLine;
              this.exception.noticeObjs = JSON.parse(this.exception.noticeObjs);
              if (this.exception.processInfo !== null) {
                this.processStateText[1] = this.exception.processInfo.handlerName + this.processStateText[1];

                this.showCompleteButton = (this.userId === this.exception.processInfo.handlerId);

                this.exception.processInfo.normVal = JSON.parse(this.exception.processInfo.normVal);
              }
            } else {
              this.$toast("请求失败" + res.message);
            }
          }).catch(err => {
        console.log(err)
      })

    },
    /**
     * 填写处理反馈
     * @private
     */
    _completeException() {
      this.$router.push({
        name: 'ExceptionComplete',
        params: {id: this.currentId, orderId: this.exception.processInfo.id}
      });
    },
    onClickLeft() {
      history.back();
    },
    /**
     * 接异常
     * @private
     */
    _processException() {
      let userInfo = sessionStorage.getItem("UserInfo");
      let username = '';
      if (userInfo) {
        username = userInfo.name;
      }
      let param = {
        exceptionId: parseInt(this.currentId),
        handlerId: this.userId,
        handlerName: username
      }
      this.$api.Exception.exceptionProcess(param)
          .then(res => {
            if (res.code === 0) {
              this.$toast("接单成功，赶紧去处理吧")
              this.exception.currentState = 1;
            } else {
              this.$toast("请求失败" + res.message);
            }
          }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted() {
    let exceptionId = this.currentId = this.$route.params.id;
    this.userId = sessionStorage.getItem("UserId");
    this._getExceptionDetails(exceptionId);
  }
}
</script>

<style scoped>
.details-wrapper {
  width: 100%;
  height: 100%;
}

.form-wrapper ::v-deep(.van-cell) {
  line-height: 28px;
}

::v-deep .van-nav-bar__content {
  width: 100%;
  background: #1989fa;
}

::v-deep( .van-badge__wrapper), ::v-deep( .van-nav-bar__text) {
  color: #fff;
}

::v-deep( .van-nav-bar__title) {
  font-weight: bold;
  color: #fff;
}
</style>
