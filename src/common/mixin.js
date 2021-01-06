import BackTop from "components/content/backTop/BackTop";

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    /**
     * 点击右下角图片返回顶部，
     * 通过 ref属性 获取 Scroll组件中的scroll属性值，
     * 然后调用scrollTo(0, 0, 500)实现功能
     * 方法中前面两个参数是坐标，
     * 第三个参数是执行回到顶部的时间（500毫秒）
     */
    backClick() {
      this.$refs.scroll && this.$refs.scroll.scroll.scrollTo(0, 0, 500)
    },
    /* 监听是否显示右下角返回顶部图标 */
    listenShowBackTop(position) {
      this.isShowBackTop = (-position.y) > 1000;
    }
  }
}
