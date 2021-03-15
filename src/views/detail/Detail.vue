<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"
                    @titleClick="titleClick"
                    ref="nav"/>
    <scroll class="content"
                  ref="scroll"
                  :pull-up-load="true"
                  @scroll="contentScroll"
                  :probe-type="3">
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"/>
    <!-- 返回顶部 -->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <toast :message="message" :isShow="show"/>
  </div>
</template>

<script>
  import DetailNavBar from "./childComps/DetailNavBar";
  import DetailSwiper from "./childComps/DetailSwiper";
  import DetailBaseInfo from "./childComps/DetailBaseInfo";
  import DetailShopInfo from "./childComps/DetailShopInfo";
  import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
  import DetailParamInfo from "./childComps/DetailParamInfo";
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import DetailBottomBar from "./childComps/DetailBottomBar";

  import Scroll from "components/common/scroll/Scroll";
  import GoodsList from "components/content/goods/GoodsList";
  import Toast from "components/common/toast/Toast";

  import { getDetail, Goods, Shop, GoodsParam, getRecommend } from "network/detail";
  import { debounce } from "common/utils"
  import { backTopMixin } from "common/mixin";
  import { mapActions } from "vuex";

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      Scroll,
      GoodsList,
      DetailBottomBar,
      Toast
    },
    /* 混入回到顶部 */
    mixins: [backTopMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        themeTopYs: [], /* 保存商品、参数、评论、推荐四个组件的offsetTop高度 */
        getThemeTopY: null, /* 给themeTopYs数组赋值 */
        currentIndex: 0,
        message: '',
        show: false
      }
    },
    created() {
      /* 1.保存传入的iid */
      this.iid = this.$route.params.iid;
      /* 2.根据iid请求详情数据 */
      getDetail(this.iid).then(res => {
        console.log(res);
        const data = res.result;
        /* 1.获取顶部图片轮播数据 */
        this.topImages = data.itemInfo.topImages;
        /* 2.获取商品信息 */
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services);
        /* 3.创建店铺信息 */
        this.shop = new Shop(data.shopInfo);
        /* 4.保存商品的详情数据 */
        this.detailInfo = data.detailInfo;
        /* 5.获取商品的参数信息 */
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule);
        /* 6.获取评论信息 */
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0];
        }
      })
      /* 3.请求推荐数据 */
      getRecommend().then(res => {
        this.recommends = res.data.list;
      })
      /* 4.给themeTopYs数组赋值，进行防抖操作 */
      this.getThemeTopY = debounce(() => {
        this.themeTopYs = [];
        this.themeTopYs.push(0);
        this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
        /* 判断条件优化 */
        this.themeTopYs.push(Number.MAX_VALUE);
      }, 300)
    },
    methods: {
      ...mapActions(['addCart']),
      imageLoad() {
        console.log('刷新成功');
        this.$refs.scroll.scroll.refresh();
        this.getThemeTopY();
      },
      titleClick(index) {
        // console.log(index);
        this.$refs.scroll.scroll.scrollTo(0, -this.themeTopYs[index], 100);
      },
      contentScroll(position) {
        /* 1.获取y值 */
        const positionY = -position.y;
        /**
         * 2.positionY和主题中值进行对比
         *
         * positionY 在 0 和 7938 之间，index = 0
         * positionY 在 7938 和 9120 之间，index = 1
         * positionY 在 9120 和 9452 之间，index = 2
         * positionY 超过 9452 值，index = 3
         */
        let length = this.themeTopYs.length;
        for(let i = 0; i < length - 1; i++) {
          let condition = positionY >= this.themeTopYs[i]
            && positionY < this.themeTopYs[i+1];
          if (this.currentIndex !== i && condition) {
            this.currentIndex = i;
            this.$refs.nav.currentIndex = this.currentIndex;
          }
        }
        /* 3.是否显示回到顶部图标 */
        this.listenShowBackTop(position);
      },
      addToCart() {
        /* 1.获取购物车需要展示的信息 */
        const product = {};
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.realPrice;
        product.iid = this.goods.iid;

        /* 2.将商品添加到购物车里 */
        this.addCart(product).then(res => {
          this.$toast.show(res, 1500);
        });
      }
    }
  }
</script>

<style scoped>
  #detail {
    position: fixed;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 44px - 44px);
  }
</style>
