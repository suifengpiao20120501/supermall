<template>
  <div id="category">
    <nav-bar class="nav-bar">
      <div slot="center">商品分类</div>
    </nav-bar>
    <div class="content">
      <tab-menu :categories="categories" @clickItem="clickItem"/>
      <scroll id="tab-content"
              ref="scroll"
              :data="[categoryData]"
              @scroll="contentScroll"
              :probe-type="3"
              :pull-up-load="true"
              @pullingUp="loadMore">
        <div>
          <tab-content-category :subcategories="showSubcategory"></tab-content-category>
          <tab-control :titles="['综合', '新品', '销量']" @tabClick="tabClick"></tab-control>
          <tab-content-detail :category-detail="showCategoryDetail"></tab-content-detail>
        </div>
      </scroll>
    </div>
    <!-- 返回顶部 -->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import TabMenu from "./childComps/TabMenu";
  import TabControl from "components/content/tabControl/TabControl";
  import Scroll from "components/common/scroll/Scroll";
  import TabContentCategory from "./childComps/TabContentCategory";
  import TabContentDetail from "./childComps/TabContentDetail";

  import {getCategory, getSubcategory, getCategoryDetail} from "network/category";
  import { debounce } from "common/utils";
  import {tabControlMixin, backTopMixin} from "common/mixin";
  import {NEW, POP, SELL} from "common/const";

  export default {
    name: "Category",
    components: {
      NavBar,
      TabMenu,
      TabControl,
      Scroll,
      TabContentCategory,
      TabContentDetail
    },
    mixins: [tabControlMixin, backTopMixin],
    data() {
      return {
        categories: [],
        categoryData: {},
        currentIndex: 0
      }
    },
    created() {
      this.getCategories();
    },
    computed: {
      showSubcategory() {
        if (this.currentIndex === -1) {
          return {};
        }
        return this.categoryData[this.currentIndex].subcategories;
      },
      showCategoryDetail() {
        if (this.currentIndex === -1) {
          return [];
        }
        return this.categoryData[this.currentIndex].categoryDetail[this.currentType];
      }
    },
    mounted() {
      /* 防止加载图片刷新频繁，进行防抖操作 */
      const refresh = debounce(this.$refs.scroll.refresh, 300);
      /* 监听item中图片加载完成 */
      this.$bus.$on('itemImageLoad', () => {
        refresh();
      });
    },
    methods: {
      getCategories() {
        getCategory().then(res => {
          /* 1.获取分类数据 */
          this.categories = res.data.category.list;
          /* 2.初始化每个类别的子数据 */
          for (let i = 0; i < this.categories.length; i++) {
            this.categoryData[i] = {
              subcategories: {},
              categoryDetail: {
                'pop': [],
                'new': [],
                'sell': []
              }
            }
          }
          /* 3.请求第一个分类的数据 */
          this.getSubcategories(0);
        })
      },
      getSubcategories(index) {
        this.currentIndex = index;
        const mailKey = this.categories[index].maitKey;
        getSubcategory(mailKey).then(res => {
          this.categoryData[index].subcategories = res.data;
          this.categoryData = {...this.categoryData};
          this.getCategoryDetails(POP);
          this.getCategoryDetails(NEW);
          this.getCategoryDetails(SELL);
        })
      },
      getCategoryDetails(type) {
        /* 1.获取请求的miniWallKey */
        const miniWallkey = this.categories[this.currentIndex].miniWallkey;
        /* 2.发送请求，传入 miniWallkey 和 type */
        getCategoryDetail(miniWallkey, type).then(res => {
          /* 3.将获取的数据保存下来 */
          this.categoryData[this.currentIndex].categoryDetail[type] = res;
          this.categoryData = {...this.categoryData}
        })
      },
      /**
       * 根据监听页面滚动的位置
       */
      contentScroll(position) {
        /* 判断 BackTop 是否显示 */
        this.listenShowBackTop(position);
      },
      clickItem(index) {
        this.getSubcategories(index);
      },
      /**
       * 上拉加载更多数据
       */
      loadMore() {
        /* 重新刷新，重新计算可以滚动高度 */
        this.$refs.scroll.refresh();
      }
    }
  }
</script>

<style scoped>
  #category {
    height: 100vh;
  }

  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
  }

  .content {
    position: absolute;
    left: 0;
    right: 0;
    top: 44px;
    bottom: 49px;
    display: flex;
    overflow: hidden;
  }

  #tab-content {
    height: 100%;
    flex: 1;
  }
</style>
