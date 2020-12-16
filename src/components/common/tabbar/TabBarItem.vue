<template>
  <div class="tab-bar-item" @click="itemClick">
    <div v-if="!isActive">
      <slot name="item-icon"></slot>
    </div>
    <div v-else>
      <slot name="item-icon-active"></slot>
    </div>
    <div v-bind:style="activeStyle">
      <slot name="item-text"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "TabBarItem",
    props: {
      path: String,
      activeColor: {
        type: String,
        default: '#ff0077'
      }
    },
    computed: {
      isActive() {
        /* 当前路径和活跃的路径进行对比，如果是一样的，为true。判断条件为：!==-1 */
        /* /home -> item1(/home) = true */
        /* /home -> item1(/category) = false */
        /* /home -> item1(/cart) = false */
        /* /home -> item1(/profile) = false */
        return this.$route.path.indexOf(this.path) !== -1
      },
      activeStyle() {
        return this.isActive ? {color: this.activeColor} : {}
      }
    },
    methods: {
      itemClick() {
        this.$router.replace(this.path)
      }
    }
  }
</script>

<style scoped>
  .tab-bar-item {
    flex: 1; /* 均等分4个div */
    text-align: center;
    height: 49px;
    font-size: 14px;
  }

  .tab-bar-item img {
    width: 24px;
    height: 24px;
    vertical-align: middle; /* 解决图片和文字之间距离 */
    margin-bottom: 2px;
  }
</style>
