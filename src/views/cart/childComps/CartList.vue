<template>
  <div class="cart-list">
    <scroll class="content" ref="scroll">
      <cart-list-item v-for="(item, index) in cartList"
        :key="index"
        :goods="item"/>
    </scroll>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  import CartListItem from "./CartListItem";

  import Scroll from "components/common/scroll/Scroll";

  export default {
    name: "CartList",
    components: {
      Scroll,
      CartListItem
    },
    computed: {
      ...mapGetters(['cartList'])
    },
    activated() {
      this.$refs.scroll.scroll.refresh();
    }
  }
</script>

<style scoped>
  .cart-list {
    height: calc(100% - 44px - 44px - 40px);
  }

  .content {
    height: 100%;
    overflow: hidden;
  }
</style>
