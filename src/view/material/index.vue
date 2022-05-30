<template>
  <div>
    <div class="material-wrapper" v-show="$route.meta.index===1">
      <van-nav-bar
          :title="$route.meta.title"
          left-text="返回"
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
  }
}
</script>

<style scoped>

</style>
