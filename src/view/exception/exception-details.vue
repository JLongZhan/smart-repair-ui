<template>
  <div>

    <router-view></router-view>
    <div class="details-wrapper" v-show="$route.meta.index===1">
      <van-nav-bar
          :title="$route.meta.title"
          left-text="返回"
          left-arrow
          @click-left="onClickLeft"
      />
      <van-form class="form-wrapper"
                v-if="exception.exceptionType==='呼叫线长'"
                border="border">
        <van-cell-group inset>
          <van-field
              v-if="exception.exceptionType"
              v-model="exception.exceptionType"
              name="通知类型"
              label="通知类型"
              readonly
          />
          <van-field
              v-model="exception.targetName"
              name="呼叫对象"
              label="呼叫对象"
              readonly
          />
          <van-field
              v-model="exception.location"
              name="呼叫地点"
              label="呼叫地点"
              readonly
          />
          <van-field
              v-model="exception.noticeObjs"
              name="通知对象"
              label="通知对象"
              readonly
          />
          <van-field
              v-model="exception.occurTime"
              name="呼叫时间"
              label="呼叫时间"
              readonly
          />
          <van-field
              v-if="exception.emergencyLevel"
              v-model="exception.emergencyLevel"
              name="紧急程度"
              label="紧急程度"
              readonly
          />
          <van-field
              v-if="exception.remark"
              v-model="exception.remark"
              name="备注信息"
              label="备注信息"
              readonly
          />
        </van-cell-group>

        <van-cell-group inset v-if="exception.processInfo !=null">
          <van-field
              v-model="exception.processInfo.handlerName"
              name="处理人员"
              label="处理人员"
              readonly
          />
          <van-field
              v-model="exception.processInfo.cause"
              name="发生原因"
              label="发生原因"
              readonly
          />
          <van-field
              v-if="exception.processInfo.normVal"
              v-model="exception.processInfo.normVal"
              name="影响指标"
              label="影响指标"
              readonly
              border
          >

          </van-field>
          <van-field
              v-model="exception.processInfo.countermeasure"
              name="处理对策"
              label="处理对策"
              readonly
          />

          <van-field
              v-if="exception.processInfo.completeTime"
              v-model="exception.processInfo.completeTime"
              name="完成时间"
              label="完成时间"
              readonly
          />


        </van-cell-group>

      </van-form>
      <van-form class="form-wrapper"
                v-else-if="exception.exceptionType==='叫/退料'"
                :border="true">
        <van-cell-group inset>
          <van-field
              v-if="exception.exceptionType"
              v-model="exception.exceptionType"
              name="通知类型"
              label="通知类型"
              readonly
          />
          <van-field
              v-model="exception.targetName"
              name="叫料对象"
              label="叫料对象"
              readonly
          />
          <van-field
              v-model="exception.location"
              name="叫料地点"
              label="叫料地点"
              readonly
          />
          <van-field
              v-model="exception.noticeObjs"
              name="通知对象"
              label="通知对象"
              readonly
          />
          <van-field
              v-model="exception.occurTime"
              name="叫料时间"
              label="叫料时间"
              readonly
          />
          <van-field
              v-if="exception.emergencyLevel"
              v-model="exception.emergencyLevel"
              name="紧急程度"
              label="紧急程度"
              readonly
          />
          <van-field
              v-if="exception.remark"
              v-model="exception.remark"
              name="备注"
              label="备注"
              readonly
          />
        </van-cell-group>
        <div v-show="exception.extraData['isArray']" class="extra-wrapper">
          <div v-for="(item,key) in exception.extraData['arrData']" :key="key">
            <van-divider :style="{ color: '#1989fa', borderColor: '#ccc', padding: '0 16px' }">
              {{ item.type }}
            </van-divider>
            <div class="extra-wrapper flex-row">
              <span>{{ item.key }}</span>
              <span>{{ item.pcs }}</span>
            </div>
            <div class="flex-row extra">
              <div class="flex-row extra-item">
            <span>  <van-icon name="home-o" color="#ee0a24"/><span> 库存 : </span>
              <span>{{ formatNum(item.count) }}</span>
</span>
              </div>
              <div class="flex-row extra-item">
              <span>
                <van-icon name="search" color="#1989fa"/>
                <span> 待IQC : </span>

              <span>{{ formatNum(item.iqc) }}</span></span>
              </div>
            </div>
            <!--          <div v-for="(val,k) in item" :key="k" class="extra-wrapper">-->
            <!--            <span>{{ k }}</span>-->
            <!--            <span>{{ formatNum(val) }}</span>-->
            <!--          </div>-->
          </div>
        </div>

        <van-cell-group inset v-if="exception.processInfo !=null">
          <van-field
              v-model="exception.processInfo.handlerName"
              name="处理人员"
              label="处理人员"
              readonly
          />
          <van-field
              v-model="exception.processInfo.cause"
              name="发生原因"
              label="发生原因"
              readonly
          />
          <van-field
              v-if="exception.processInfo.normVal"
              v-model="exception.processInfo.normVal"
              name="影响指标"
              label="影响指标"
              readonly
              border
          >

          </van-field>
          <van-field
              v-model="exception.processInfo.countermeasure"
              name="处理对策"
              label="处理对策"
              readonly
          />

          <van-field
              v-if="exception.processInfo.completeTime"
              v-model="exception.processInfo.completeTime"
              name="完成时间"
              label="完成时间"
              readonly
          />


        </van-cell-group>

      </van-form>
      <van-form class="form-wrapper"
                v-else
                border="border">
        <van-cell-group inset>
          <van-field
              v-if="exception.exceptionType"
              v-model="exception.exceptionType"
              name="通知类型"
              label="通知类型"
              readonly
          />
          <van-field
              v-model="exception.targetName"
              name="异常对象"
              label="异常对象"
              readonly
          />
          <van-field
              v-model="exception.location"
              name="异常地点"
              label="异常地点"
              readonly
          />
          <van-field
              v-model="exception.noticeObjs"
              name="通知对象"
              label="通知对象"
              readonly
          />
          <van-field
              v-model="exception.occurTime"
              name="异常时间"
              label="异常时间"
              readonly
          />
          <van-field
              v-if="exception.emergencyLevel"
              v-model="exception.emergencyLevel"
              name="紧急程度"
              label="紧急程度"
              readonly
          />
          <van-field
              v-if="exception.remark"
              v-model="exception.remark"
              name="备注"
              label="备注"
              readonly
          />
        </van-cell-group>
        <van-cell-group inset v-if="exception.processInfo !=null">
          <van-field
              v-model="exception.processInfo.handlerName"
              name="处理人员"
              label="处理人员"
              readonly
          />
          <van-field
              v-model="exception.processInfo.cause"
              name="发生原因"
              label="发生原因"
              readonly
          />
          <van-field
              v-if="exception.processInfo.normVal"
              v-model="exception.processInfo.normVal"
              name="影响指标"
              label="影响指标"
              readonly
              border
          >

          </van-field>
          <van-field
              v-model="exception.processInfo.countermeasure"
              name="处理对策"
              label="处理对策"
              readonly
          />

          <van-field
              v-if="exception.processInfo.completeTime"
              v-model="exception.processInfo.completeTime"
              name="完成时间"
              label="完成时间"
              readonly
          />


        </van-cell-group>

      </van-form>
      <div style="margin: 16px;">
        <van-button round block :type="exception.currentState===2?'success':'primary'" @click="_processException"
                    :readonly="exception.currentState!==0">
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
        0: '马上处理',
        1: '处理中',
        2: '已完成'
      },
      showCompleteButton: false,
      exception: {
        targetName: "",
        extraData: "",
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
    isNumber(s) {
      return Object.prototype.toString.call(s) === '[object Number]';
    },
    formatNum(value) {
      // 只处理数字
      if (!this.isNumber(value)) {
        return value;
      }

      value = value + '';
      var newStr = "";
      var count = 0;

      if (value.indexOf(".") == -1) {
        for (var i = value.length - 1; i >= 0; i--) {
          if (count % 3 == 0 && count != 0) {
            newStr = value.charAt(i) + "," + newStr;
          } else {
            newStr = value.charAt(i) + newStr;
          }
          count++;
        }
        value = newStr;
        // console.log(value)
      } else {
        for (let i = value.indexOf(".") - 1; i >= 0; i--) {
          if (count % 3 === 0 && count !== 0) {
            newStr = value.charAt(i) + "," + newStr;
          } else {
            newStr = value.charAt(i) + newStr; //逐个字符相接起来
          }
          count++;
        }
        value = newStr + (value + "00").substr((value + "00").indexOf("."), 3);
        // console.log(value)
      }
      return value;
    },
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

              this.exception.targetDescription = this.exception.targetDescription || '';
              this.exception.targetName += this.exception.targetDescription?('-' + this.exception.targetDescription):this.exception.targetDescription

              if (this.exception.location === null && this.exception.bindLine === null){
                this.exception.location = ''
              }else if(this.exception.location === null && this.exception.bindLine !== null){
                this.exception.location = this.exception.bindLine;
              } else if(this.exception.location !== null && this.exception.bindLine !== null){
                this.exception.location += " " + this.exception.bindLine;
              }
              // this.exception.location += " " + this.exception.bindLine;

              this.exception.noticeObjs = JSON.parse(this.exception.noticeObjs);
              if (this.exception.extraData != null && this.exception.extraData.length > 0) {
                this.exception.extraData = JSON.parse(this.exception.extraData);
              }

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
        query: {id: this.currentId, orderId: this.exception.processInfo.id}
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
      console.log(userInfo)
      let username = '';
      if (userInfo) {
        username = JSON.parse(userInfo).name;
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
    let exceptionId = this.currentId = this.$route.query.id;
    this.userId = sessionStorage.getItem("UserId");
    this._getExceptionDetails(exceptionId);
  }
}
</script>

<style scoped>
.details-wrapper {
  width: 100%;
  overflow: hidden;
}

.extra-wrapper {
}

.extra-wrapper .extra-item {
  font-size: 14px;
  width: 50%;
}

.flex-row {
  display: flex;
  justify-content: space-between;
  padding: 2px 16px;
  align-items: center;
}

.extra-wrapper span {
  margin: 1px 0;
}

.van-divider {
  margin: 5px 0 !important;
}

input {
  word-break: break-all !important;
  overflow: auto;
  white-space: normal;

}

::v-deep(.van-field__label) {
  color: #323233 !important;

}

.form-wrapper ::v-deep(.van-cell) {
  line-height: 28px;
  padding: 5px 2px;
}

</style>
