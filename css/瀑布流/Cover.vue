<template>
  <div>
    <div class="cover-img" :style="{ height: itemWidth*height + 'px', width: itemWidth + 'px'}">
      <img :src="src" :alt="alt" />
    </div>
    <!-- 控制封面图高度 -->
    <div class="holder" :style="'padding-bottom:' + height*100 + '%'"></div>
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
      type: Number,
      default: 0
    },
    itemWidth: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {}
  },
  mounted () {
    console.log(this.height)
  }

}
</script>

<style lang="scss" scoped>
.cover-img {
  position: absolute;
  width: 100%;
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
