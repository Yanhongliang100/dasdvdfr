import { getToken, setToken, removeToken } from '@/utils/auth'
import request from '@/utils/request'
import store from '../index'
const user = {
  state: {
    token: '',
    avatar: '',
    roles: [],
    setting: {
      articlePlatform: []
    },
    is_cadre: '1',
    is_certification: '1',
    login_name: '',
    mobile: '',
    nick_name: '',
    org_name: '',
    org_type: '',
    organ_id: '',
    leaderarrs: [],
    leaderLevel: 1,
    wait: 0,
    admin: 0,
    leaderLevel: 1,
    tok: "11"
  },

  mutations: {
    SET_MOBILE: (state, mobile) => {
      state.mobile = mobile
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NICK_NAME: (state, nick_name) => {
      state.nick_name = nick_name
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_LOGIN_NAME: (state, login_name) => {
      state.login_name = login_name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_WAIT: (state, wait) => {
      state.wait = wait
    },
    SET_ADMIN: (state, admin) => {
      state.admin = admin
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        request.post('uts/user/login', { name: username, pass: userInfo.password }).then(response => {
          commit('SET_TOKEN', response.logintoken)// 请求用token
          setToken(response.refreshtoken)// 刷新用长token
          resolve()
        }).catch(error => {

        })
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        request.post('uts/user/getUserInfo').then(response => {
          if (response.is_cadre === 1) {
            commit('SET_ROLES', ['admin'])
          }
          commit('SET_LOGIN_NAME', response.login_name)
          commit('SET_MOBILE', response.mobile)
          commit('SET_NICK_NAME', response.nick_name)
          commit('SET_AVATAR', response.user_pic)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(response => {
    //       commit('SET_TOKEN', response.data.token)
    //       setToken(response.data.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        request.post('uts/user/logout', { loginToken: this.token, refreshToken: getToken() }).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
