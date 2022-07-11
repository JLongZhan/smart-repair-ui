<template>
  <div style="height: 100%;width: 100%;overflow: hidden">
    <van-tabs v-model:active="active" @change="_onTabChange" type="card" class="tab-wrapper">
      <van-tab title="总部">
      </van-tab>
      <van-tab title="声智联">
      </van-tab>
    </van-tabs>

    <div id="snodCode"></div>

    <div></div>
  </div>
</template>

<script>
import WwLogin from '../../assets/common/wwLogin-1.2.5'

export default {
  data() {
    return {
      text: "",
      active: 0,
    };
  },
  methods: {
    _onTabChange(e) {
      if (e === 0) {
        new WwLogin({
          "id": "snodCode",
          "appid": "wxb0e730f57b92d615",
          "agentid": "1000042",
          "redirect_uri": "http://platform.3nod.com.cn:200",
          "state": "HQ",
          "href": "",
          "lang": "zh",
        });

      } else {
        new WwLogin({
          "id": "snodCode",
          "appid": "wwa829f865e11ecdd0",
          "agentid": "1000070",
          "redirect_uri": "http://platform.3nod.com.cn:200",
          "state": "STATE",
          "href": "",
          "lang": "zh",
        });

      }
    }
  },
  mounted() {
    this._onTabChange(this.active)
  }
};
</script>

<style scoped>
#snodCode {
  padding: 10px;
  display: flex;
  justify-content: center;
}

iframe {
  width: 100% !important;
  min-height: 350px
}

.tab-wrapper {
  width: 50%;
  color: #323233 !important;
  border-color: #323233 !important;
  margin: 20px auto;
}


</style>
