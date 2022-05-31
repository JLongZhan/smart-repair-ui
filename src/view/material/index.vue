<template>
  <div>
    <div class="material-wrapper" v-show="$route.meta.index===1">
      <van-nav-bar
          left-text="返回"
          :title="$route.meta.title"
          left-arrow
          @click-left="onClickLeft"
      />
      <van-card
          num="2"
          price="2.00"
          desc="描述信息"
          title="商品标题"
          thumb="https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  methods: {
    onClickLeft() {
      history.back();
    },

    getMaterialList() {
      let param = {}
      this.$api.Material.getWorkPlan(param, "http://192.168.162.118:8007")
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.log(err);
          })
    }
  },
  mounted() {
    console.log(123)
    this.getMaterialList();
  },
  created() {
    console.log(213)
  }
}
</script>

<style scoped>

</style>
