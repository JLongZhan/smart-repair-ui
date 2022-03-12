<template>


    <div id="code">
  </div>

</template>

<script>

import WwLogin from '../../assets/common/wwLogin-1.2.5'

export default {
  data() {
    return {


    };
  },

  methods: {

  },
  mounted() {
    new WwLogin({
      "id": "code",
      "appid": "wxb0e730f57b92d615",
      "agentid": "1000042",
      "redirect_uri": "http://platform.acousticlink.com.cn:200",
      "state": "STATE",
      "href": "",
      "lang": "zh",
    });
  }
};
</script>

<style lang="less">
#code {
  padding: 20px;
  display: flex;
  justify-content: center;
}
</style>
