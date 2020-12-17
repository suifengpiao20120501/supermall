<template>
  <div id="home">
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <home-recommend-view :recommends="recommends"/>
    <feature-view/>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import HomeRecommendView from "./childComps/HomeRecommendView";
  import FeatureView from "./childComps/FeatureView";

  import {getHomeMultidata} from "@/network/home";

  export default {
    name: "Home",
    components: {
      NavBar,
      HomeRecommendView,
      FeatureView
    },
    data() {
      return {
        banners: [],
        recommends: []
      }
    },
    created() {
      /* 1.请求多个数据 */
      getHomeMultidata().then(res => {
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      })
    }
  }
</script>

<style scoped>
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
  }
</style>
