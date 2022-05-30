<template>
  <div class="complete-wrapper" v-if="$route.meta.index===2">
    <van-nav-bar
        title="异常详情"
        left-text="返回"
        left-arrow
        @click-left="onClickLeft"
    />
    <van-cell-group inset>
      <van-field
          v-model="cause"
          rows="3"
          autosize
          error
          required
          label="异常原因"
          type="textarea"
          maxlength="500"
          placeholder="请输入您发现的异常原因"
          show-word-limit
      />
      <van-divider
          :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 10px' }">
        影响指标
      </van-divider>
      <van-checkbox-group v-model="impactValues" direction="horizontal" style="margin: 10px 0px">
        <van-checkbox style="padding: 5px " :name="item" v-for="(item, index) in impactIndicatorList"
                      @click="checkToggle(item)" :key="index">
          {{ item }}
        </van-checkbox>
      </van-checkbox-group>
      <van-divider
          :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 10px' }">
      </van-divider>
      <van-field
          v-model="countermeasure"
          rows="3"
          error
          required
          autosize
          label="处理对策"
          type="textarea"
          maxlength="500"
          placeholder="请输入对应的处理对策"
          show-word-limit
      />
      <!--      <van-field-->
      <!--          v-model="remark"-->
      <!--          rows="3"-->
      <!--          autosize-->
      <!--          label="异常完成时间"-->
      <!--          type="textarea"-->
      <!--          placeholder="可选,默认当前时间"-->
      <!--          show-word-limit-->
      <!--      />-->
      <van-field
          v-model="chooseDateTime"
          is-link
          readonly
          name="calendar"
          label="处理完成时间"
          placeholder="点击选择时间,默认当前时间"
          @click="showCalendar = true"
      />
      <van-overlay :show="showCalendar" @click="showCalendar = false">
        <van-datetime-picker type="datetime"
                             v-model="currentDateTime"
                             class="overlay-wrapper"
                             :min-date="minDate"
                             @cancel="showCalendar = false"
                             @confirm="_onDateConfirmChoose"/>
      </van-overlay>
    </van-cell-group>

    <van-button type="primary" size="large" @click="_complete">提交</van-button>

  </div>
</template>

<script>
export default {
  name: "process-complete",
  data() {
    return {
      orderId: undefined,
      exceptionId: undefined,
      cause: "",
      countermeasure: "",
      remark: "",
      showCalendar: false,
      currentDateTime: new Date(),
      chooseDateTime: new Date(),
      impactValues: [],
      normValues: [],
      impactIndicatorList: ['品质', '效率', '交期', '成本', '安全'],
      minDate: new Date(2022, 2, 1)
    }
  },
  methods: {
    checkToggle(event) {
      console.log("checkToggle", event);
    },
    _onDateConfirmChoose(val) {
      console.log(val);
      let h = val.getHours();
      if (h >= 0 && h <= 9)
        h = '0' + h

      let m = val.getMinutes();
      if (m >= 0 && m <= 9)
        m = '0' + m
      this.currentDateTime = `${1900 + val.getYear()}-${val.getMonth() + 1}-${val.getDate()} ${h}:${m}`;
      this.showCalendar = false;
      this.chooseDateTime = this.currentDateTime;
    },
    onClickLeft() {
      history.back();
    },
    _complete() {
      let param = {
        exceptionId: this.exceptionId,
        id: this.orderId,
        cause: this.cause,
        countermeasure: this.countermeasure,
        remark: this.remark,
        completeTime: this.chooseDateTime,
        normValues: this.impactValues
      }
      console.log(param)

      this.$api.Exception.exceptionProcessComplete(param)
          .then(res => {
            if (res.code === 0) {
              this.$toast("提交成功");
              this.$router.replace({name: 'Exception'})
            } else {
              this.$toast("提交失败" + res.message);
            }
          }).catch(err => {
        console.log(err)
      })
    }
  },

  mounted() {
    this.exceptionId = this.$route.query.id;
    this.orderId = this.$route.query.orderId;
    console.log('mounted', this.exceptionId, this.orderId)
    this.chooseDateTime = this.$dateFormat(new Date(), 'yyyy-mm-dd H:MM')
  }
}
</script>

<style scoped>
.complete-wrapper {
  width: 100%;
  height: 100%;
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

.overlay-wrapper {
  width: 100%;
  position: absolute;
  bottom: 40%;
}
</style>
