<template>
  <grid-view :cols="2">
    <goods-list-item class="goods-list-item"
                     v-for="(item, index) in categoryDetail"
                     :key="index" :goodsItem="item"/>
  </grid-view>
</template>

<script>
  import GridView from "components/common/gridView/GridView";
  import GoodsListItem from "components/content/goods/GoodsListItem";

  export default {
    name: "TabContentDetail",
    components: {
      GoodsListItem,
      GridView
    },
    props: {
      categoryDetail: {
        type: Array,
        default() {
          return [];
        }
      }
    }
  }
</script>

<style scoped>

</style>
