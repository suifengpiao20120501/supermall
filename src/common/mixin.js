import BackTop from "components/content/backTop/BackTop";
import {POP, NEW, SELL, BACKTOP_DISTANCE} from "./const";

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
      this.$refs.scroll && this.$refs.scroll.scrollTo(0, 0, 500)
    },
    /* 监听是否显示右下角返回顶部图标 */
    listenShowBackTop(position) {
      this.isShowBackTop = (-position.y) > BACKTOP_DISTANCE;
    }
  }
}

export const tabControlMixin = {
  data() {
    return {
      currentType: POP
    }
  },
  methods: {
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = POP;
          break;
        case 1:
          this.currentType = NEW;
          break;
        case 2:
          this.currentType = SELL;
          break;
      }
    }
  }
}
