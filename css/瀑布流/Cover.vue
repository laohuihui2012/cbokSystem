// 封面图Cover.vue子组件
<template>
  <div>
    <div class="cover-img">
      <img :src="src" :alt="alt" />
    </div>
    <!-- 控制封面图高度 -->
    <div class="holder" :style="'padding-bottom:' + height"></div>
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: '100%'
    }
  },
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.cover-img {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  background-position: 50%;
  background-size: cover;
}
.cover-img img {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 50%;
  height: 100%;
  transform: translateX(-50%);
}
.holder {
  width: 100%;
  position: relative;
  padding-bottom: 100%;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
