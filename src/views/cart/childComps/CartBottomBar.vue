<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button class="check-button"/>
      <span>全选</span>
    </div>

    <div class="totalPrice">
      合计：{{totalPrice}}
    </div>

    <div class="calculate">
      去结算({{checkLength}})
    </div>
  </div>
</template>

<script>
  import CheckButton from "components/content/CheckButton/CheckButton";

  import { mapGetters } from 'vuex';

  export default {
    name: "CartBottomBar",
    components: {
      CheckButton
    },
    computed: {
      ...mapGetters(['cartList']),
      totalPrice() {
        return '￥' + this.cartList.filter(item => {
          return item.checked;
        }).reduce((preValue, item) => {
          return preValue + item.price * item.count;
        }, 0).toFixed(2);
      },
      checkLength() {
        return this.cartList.filter(item => item.checked).length;
      }
    }
  }
</script>

<style scoped>
  .bottom-bar {
    height: 40px;
    background-color: #eee;
    position: relative;
    display: flex;
    bottom: 0px;
    line-height: 40px;
    font-size: 14px;
  }

  .check-content {
    display: flex;
    align-items: center;
    width: 60px;
  }

  .check-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin: -2px 4px 0px 4px;
  }

  .totalPrice {
    margin-left: 20px;
    flex: 1;
  }

  .calculate {
    width: 90px;
    background-color: var(--color-tint);
    color: #fff;
    text-align: center;
    font-size: 16px;
  }
</style>
