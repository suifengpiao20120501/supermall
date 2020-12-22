<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from "better-scroll"

  export default {
    name: "Scroll",
    props: {
      probeType: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        scroll: null
      }
    },
    mounted() {
      /* 1.创建BScroll对象 */
      /* this.$refs.wrapper：获取指定属性 ref = wrapper 的div元素 */
      this.scroll = new BScroll(this.$refs.wrapper, {
        /* 允许点击scroll中的组件 */
        click: true,
        probeType: this.probeType
      })

      /* 2.监听滚动的位置 */
      this.scroll.on('scroll', (position) => {
        /*console.log(position);*/
        this.$emit('scroll', position);
      })
    }
  }
</script>

<style scoped>

</style>
