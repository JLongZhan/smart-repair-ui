<template>
  <div class="complete-wrapper">
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
          maxlength="50"
          placeholder="请输入您发现的异常原因"
          show-word-limit
      />
      <van-field
          v-model="countermeasure"
          rows="3"
          error
          required
          autosize
          label="处理对策"
          type="textarea"
          maxlength="50"
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
          v-model="date"
          is-link
          readonly
          name="calendar"
          label="异常完成日期"
          placeholder="点击选择日期"
          @click="showCalendar = true"
      />
      <van-calendar v-model:show="showCalendar" @confirm="_onDateConfirmChoose"/>
      <van-field
          v-model="time"
          is-link
          readonly
          name="datetimePicker"
          label="异常完成时间"
          placeholder="点击选择时间"
          @click="showTimePicker = true"

      />
      <van-popup v-show="showTimePicker" position="bottom">
        <van-datetime-picker
            type="time"
            @confirm="_onTimeConfirmChoose"
            @cancel="showTimePicker = false"
        />
      </van-popup>
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
      showTimePicker: false,
      showCalendar: false,
      date: "",
      time: ''
    }
  },
  methods: {
    _onDateConfirmChoose(val) {
      console.log("_onDateConfirmChoose", val)
      this.date = `${1900 + val.getYear()}-${val.getMonth() + 1}-${val.getDate()}`;
      this.showCalendar = false;
    },
    _onTimeConfirmChoose(value) {
      console.log("_onTimeConfirmChoose", value)
      this.time = value;
      this.showTimePicker = false;
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
        completeTime: this.date + " " + this.time
      }
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
    this.exceptionId = this.$route.params.id;
    this.orderId = this.$route.params.orderId;
    console.log('mounted', this.exceptionId, this.orderId)
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
</style>
