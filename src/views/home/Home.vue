<template>
  <div id="home" class="wrapper">
    <!-- 导航栏 -->
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>

    <!-- 页面滑动 -->
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <home-recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control class="tab-control"
                   :titles="['流行', '新款', '精选']"
                   @tabClick="tabClick"/>
      <goods-list :goods="showGoods"/>
    </scroll>

    <!-- 返回顶部 -->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import HomeRecommendView from "./childComps/HomeRecommendView";
  import FeatureView from "./childComps/FeatureView";

  import NavBar from "components/common/navbar/NavBar";
  import Scroll from "components/common/scroll/Scroll";
  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";
  import BackTop from "components/content/backTop/BackTop";

  import { getHomeMultidata, getHomeGoods } from "@/network/home";

  export default {
    name: "Home",
    components: {
      TabControl,
      NavBar,
      HomeRecommendView,
      FeatureView,
      GoodsList,
      Scroll,
      BackTop
    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []}
        },
        currentType: 'pop',
        isShowBackTop: false
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list;
      }
    },
    created() {
      /* 1.请求多个数据 */
      this.getHomeMultidata();
      /* 2.请求商品数据 */
      this.getHomeGoods('pop');
      this.getHomeGoods('new');
      this.getHomeGoods('sell');
    },
    methods: {
      /**
       * 事件监听相关的方法
       */
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop';
            break;
          case 1:
            this.currentType = 'new';
            break;
          case 2:
            this.currentType = 'sell';
            break;
        }
      },
      /**
       * 点击右下角图片返回顶部，
       * 通过 ref属性 获取 Scroll组件中的scroll属性值，
       * 然后调用scrollTo(0, 0, 500)实现功能
       * 方法中前面两个参数是坐标，
       * 第三个参数是执行回到顶部的时间（500毫秒）
       */
      backClick() {
        this.$refs.scroll.scroll.scrollTo(0, 0, 500)
      },
      /**
       * 根据监听页面滚动的位置，
       * 判断是否显示右下角的图片
       */
      contentScroll(position) {
        // console.log(position);
        this.isShowBackTop = (-position.y) > 1000
      },
      /**
       * 网络请求相关的方法
       */
      getHomeMultidata() {
        /* 1.请求多个数据 */
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type) {
        // console.log(type);
        /* 第几页 */
        const page = this.goods[type].page + 1;
        /* 2.请求商品数据 */
        getHomeGoods(type, page).then(res => {
          // console.log(res);
          /* 使用...语法将数组中每个元素取出来后添加到数组中，页数加1 */
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page += 1;
        })
      }
    }
  }
</script>

<style scoped>
  #home {
    /*padding-top: 44px;*/
    height: 100vh;
    position: relative;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    /* 固定导航栏在顶部 */
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
  }

  .tab-control {
    position: sticky; /* 滑动页面时固定tabControl组件 */
    top: 44px; /* 距离顶部44px时，固定组件 */
    z-index: 9;
  }

  .content {
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    right: 0;
  }

  /*.content {
    height: calc(100% - 93px);
    overflow: hidden;
    margin-top: 44px;
  }*/
</style>
