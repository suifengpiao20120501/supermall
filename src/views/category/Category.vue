<template>
  <div id="category">
    <nav-bar class="nav-bar">
      <div slot="center">商品分类</div>
    </nav-bar>
    <div class="content">
      <tab-menu :categories="categories" @clickItem="clickItem"/>
      <scroll id="tab-content" :data="[categoryData]">
        <div>
          <tab-content-category :subcategories="showSubcategory"></tab-content-category>
          <tab-control :titles="['综合', '新品', '销量']" @tabClick="tabClick"></tab-control>
          <tab-content-detail :category-detail="showCategoryDetail"></tab-content-detail>
        </div>
      </scroll>
    </div>
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
  import {tabControlMixin} from "common/mixin";
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
    mixins: [tabControlMixin],
    data() {
      return {
        categories: [],
        categoryData: {},
        currentIndex: -1
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
      clickItem(index) {
        this.getSubcategories(index);
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
    /*font-weight: 700;*/
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
