<template>
  <div id="home" class="wrapper">
    <!-- 导航栏 -->
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <!-- 标题控制 -->
    <tab-control class="tab-control"
                 :titles="['流行', '新款', '精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 v-show="isTabFixed"/>
    <!-- 页面滑动 -->
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <!-- 轮播图 -->
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <home-recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行', '新款', '精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </scroll>
    <!-- 返回顶部 -->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import HomeSwiper from "./childComps/HomeSwiper";
  import HomeRecommendView from "./childComps/HomeRecommendView";
  import FeatureView from "./childComps/FeatureView";

  import NavBar from "components/common/navbar/NavBar";
  import Scroll from "components/common/scroll/Scroll";

  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";

  import { getHomeMultidata, getHomeGoods } from "@/network/home";
  import { backTopMixin } from "common/mixin";
  import { debounce } from "common/utils";
  import { POP, NEW, SELL } from "common/const";

  export default {
    name: "Home",
    components: {
      HomeSwiper,
      TabControl,
      NavBar,
      HomeRecommendView,
      FeatureView,
      GoodsList,
      Scroll
    },
    /* 混入回到顶部 */
    mixins: [backTopMixin],
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []}
        },
        currentType: POP,
        tabOffsetTop: 0, /* tabControl到顶部距离 */
        isTabFixed: false, /* tabControl是否吸顶，默认不吸顶 */
        saveY: 0 /* 保存页面滑动后高度，默认是 0 */
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list;
      }
    },
    activated() {
      /* 新创建组件时，页面滚动到离开时的位置 */
      this.$refs.scroll.scrollTo(0, this.saveY);
      /* 重新刷新，防止页面不能滚动 */
      this.$refs.scroll.refresh();
    },
    deactivated() {
      /* 离开首页时，记录离开首页时的位置 */
      this.saveY = this.$refs.scroll.getScrollY();
      /* 测试离开时的页面位置 */
      console.log(this.$refs.scroll.scroll.y);
    },
    created() {
      /* 1.请求多个数据 */
      this.getHomeMultidata();
      /* 2.请求商品数据 */
      this.getHomeGoods(POP);
      this.getHomeGoods(NEW);
      this.getHomeGoods(SELL);
    },
    mounted() {
      /* 防止轮播图加载图片刷新频繁，进行防抖操作 */
      const refresh = debounce(this.$refs.scroll.refresh, 300);
      /* 监听item中图片加载完成 */
      this.$bus.$on('itemImageLoad', () => {
        refresh();
      });
    },
    methods: {
      /**
       * 事件监听相关的方法
       */
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
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      /**
       * 根据监听页面滚动的位置
       */
      contentScroll(position) {
        /* 1.判断BackTop是否显示 */
        this.listenShowBackTop(position);
        /* 2.决定tabControl是否吸顶（position：fixed） */
        this.isTabFixed = (-position.y) > this.tabOffsetTop;
      },
      /**
       * 上拉加载更多数据
       */
      loadMore() {
        this.getHomeGoods(this.currentType);
        /* 重新刷新，重新计算可以滚动高度 */
        this.$refs.scroll.refresh();
      },
      /* 获取 tabControl组件 到顶部的距离 */
      swiperImageLoad() {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
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
          /* 页面上拉刷新一次数据后，继续刷新数据 */
          this.$refs.scroll.finishPullUp();
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
    /*position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;*/
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }

  /*.tab-control {
    position: sticky; !* 滑动页面时固定tabControl组件 *!
    top: 44px; !* 距离顶部44px时，固定组件 *!
    z-index: 9;
  }*/

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
