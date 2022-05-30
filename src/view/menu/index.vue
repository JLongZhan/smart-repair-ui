<template>
  <div>
    <router-view></router-view>
    <div class="menu-wrapper" v-show="$route.meta.index===0">
      <van-grid square :column-num="3">
        <van-grid-item icon="fire" text="物料预警" to="/menu/material"/>
      </van-grid>
    </div>
  </div>

</template>

<script>
export default {
  name: "menu"
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
