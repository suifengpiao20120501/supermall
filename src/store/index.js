import Vue from 'vue';
import Vuex from 'vuex';

import getters from "./getters";

/* 1.安装插件 */
Vue.use(Vuex);

/* 2.创建Store对象 */
const store = new Vuex.Store({
  getters,
  state: {
    cartList: []
  },
  mutations: {
    addCounter(state, payload) {
      payload.count++;
    },
    addToCart(state, payload) {
      payload.checked = true;
      state.cartList.push(payload);
    }
  },
  actions: {
    addCart(context, payload) {
      return new Promise((resolve) => {
        /* payload：新添加的商品 */
        /* 1.查找之前数组中是否有该商品，如果有，将item返回给oldProduct */
        let oldProduct = context.state.cartList.find(item => item.iid === payload.iid);
        /* 2.判断oldProduct中是否有值 */
        if (oldProduct) {
          context.commit('addCounter', oldProduct);
          resolve('当前商品数量+1');
        } else {
          payload.count = 1;
          context.commit('addToCart', payload);
          resolve('添加了新的商品');
        }
      });
    }
  }
})

/* 3.挂载到Vue实例上 */
export default store
