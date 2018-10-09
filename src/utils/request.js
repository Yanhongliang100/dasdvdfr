import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import qs from 'qs'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // request timeout
})
let tokenLock = false
// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  // console.log(config.url + '加头' + store.state.user.token)
  // console.log(config.url + '加头' + store.state.user.login_name)
  // if (store.state.user.token) {
  // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  config.headers['Authorization'] = store.state.user.token
  // }
  // 以下默认post请求转为URL格式，除非指定了Content-Type
  if (config.method === 'post' && config.headers['Content-Type'] !== 'application/json') {
    config.data = qs.stringify(config.data)// 转换为url形式，防止post请求参数无法传到后台
  }
  return config
}, error => {
  Message.error({ message: '请求超时!' })
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use((response) => {
  const res = response.data
  const config = response.config // 保存原请求
  // 根据返回的code值来做不同的处理（和后端约定）
  // console.log('请求' + response)
  if (res.code.indexOf('-1') >= 0) {
    const err = new Error(res.msg)
    err.code = res.code
    Message({
      message: err.message,
      type: 'error',
      duration: 4 * 1000
    })
    return Promise.reject(err)
  } else {
    const code = res.code.substring(res.code.length - 5)
    // console.log('请求了')
    if (code === 'I0000') {
      return res.data
    } else if (code === '10105') { // token校验失败或失效
      if (getToken()) {
        if (!tokenLock) {
          tokenLock = true
          const longToken = { 'token': getToken() }
          // 去获取新的token
          return service.post('uts/user/refreshToken', longToken).then((response) => {
            // 保存新的token
            // console.log('保存token：' + response)
            store.commit('SET_TOKEN', response)
            // 重新调用原请求
            config.headers.Authorization = store.getters.token
            tokenLock = false
            return axios(config).then((response) => {
              return response.data.data
            }).catch((err) => { // 调用失败
              return Promise.reject(err)
            })
          }).catch(() => { // 更新token失败，重定向到登录login
            tokenLock = false
            this.$router.push('/login')
          })
        } else {
          this.$router.push('/login')
        }
      } else {
        // 如果有并发请求，在锁定时，调用checkToken，直到解锁后，执行原请求
        return checkToken().then((aa) => {
          axios(config).then((response) => {
            return response.data.data
          }).catch((err) => { // 调用失败
            return Promise.reject(err)
          })
        })
      }
    } else {
      // console.log(res)

      const err = new Error(res.msg)
      err.code = res.code
      Message({
        message: err.message,
        type: 'error',
        duration: 4 * 1000
      })
      return Promise.reject(err)
    }
  }
},
error => {
  console.log('err' + error) // for debug
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
  return Promise.reject(error)
})
function checkToken(resolve, reject) {
  var p = new Promise(function(resolve, reject) {
    if (tokenLock) {
      setTimeout(function() {
        checkToken().then(resolve)
      }, 500)
    } else {
      resolve()
    }
  })
  return p
}

export default service
