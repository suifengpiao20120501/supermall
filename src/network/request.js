import axios from 'axios'

/* 4.第四种方式，推荐使用 */
export function request(config) {
  /* 1.创建axios的实例 */
  const instance = axios.create({
    // baseURL: 'http://123.207.32.32:8000',
    baseURL: 'http://152.136.185.210:8000/api/w6',
    timeout: 5000
  })

  /* 2.axios的全局拦截器 */
  /* 2.1.请求拦截器 */
  instance.interceptors.request.use(config  => {
    // 1.假设config中的一些信息不符合服务器的要求
    // 2.每次发送网络请求时，都希望在界面中显示一个请求的图标
    // 3.某些网络请求（比如登陆（token）），必须携带一些特殊的信息
    return config; // 拦截以后，要返回配置，不然会报错
  }, err => {
    console.log(err);
  })

  /* 2.2.响应拦截器 */
  instance.interceptors.response.use(res => {
    return res.data // 返回我们需要的data信息
  }, err => {
    console.log(err);
  })

  /* 3.发送真正的网络请求 */
  return instance(config)
}



/* 1.第一种方式 */
/*export function request(config, success, failure) {
  /!* 1.创建axios的实例 *!/
  const instance = axios.create({
    baseURL: 'http://123.207.32.32:8000',
    timeout: 5000
  })

  /!* 发送真正的网络请求 *!/
  instance(config).then(res => {
    // console.log(res);
    success(res);
  }).catch(err => {
    // console.log(err);
    failure(err);
  })
}*/



/* 2.第二种方式 */
/*export function request(config) {
  /!* 1.创建axios的实例 *!/
  const instance = axios.create({
    baseURL: 'http://123.207.32.32:8000',
    timeout: 5000
  })

  /!* 发送真正的网络请求 *!/
  instance(config.baseConfig).then(res => {
    // console.log(res);
    success(res);
  }).catch(err => {
    // console.log(err);
    failure(err);
  })
}*/



/* 3.第三种方式 */
// export function request(config) {
//   return new Promise((resolve, reject) => {
//     /* 1.创建axios的实例 */
//     const instance = axios.create({
//       baseURL: 'http://123.207.32.32:8000',
//       timeout: 5000
//     })
//
//     /* 2.发送真正的网络请求 */
//     instance(config).then(res => {
//       resolve(res)
//     }).catch(err => {
//       reject(err)
//     })
//   })
// }
