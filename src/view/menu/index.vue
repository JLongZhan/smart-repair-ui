<template>
  <div>
    <router-view></router-view>
    <div class="menu-wrapper" v-show="$route.meta.index===0">
      <van-grid square :column-num="3">
        <van-grid-item icon="fire" text="物料预警" to="/menu/material"/>
        <van-grid-item icon="bill" text="报工" color="#1989fa" :url="reportUrl"/>
      </van-grid>
    </div>
  </div>
</template>

<script>
export default {
  name: "menu",
  data() {
    return {
      reportUrl: process.env.VUE_APP_REPORT_URL
    }
  },
  created() {
    if (!sessionStorage.getItem('userId')) {
      let url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb0e730f57b92d615&redirect_uri=platform.3nod.com.cn:200&response_type=code&scope=snsapi_base&agentid= 1000042&state=#wechat_redirect'
      location.replace(url);
    }
  }
}
</script>

<style scoped>
.menu-wrapper {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5
}

::v-deep(.van-grid-item__text) {
  font-size: 16px;
  color: #323233;
}

::v-deep(.van-grid-item__icon) {
  color: red !important;
}
</style>
