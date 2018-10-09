import relationjson from '../../../static/relation.json'
import request from '@/utils/request'
// 初始化数据
const dict = {
  state: {
    nav_index: 0,
    alljson: relationjson, // 静态json
    provinces: []
  },
  mutations: {
    SET_PROVICECES: (state, provices) => {
      state.provinces = provices
    }
  },

  actions: {
    getProvince({ commit }) {
      return new Promise((resolve, reject) => {
        request.post('eai/authRegion/selectDate', { parentId: 100 }).then(response => {
          console.log(response)
          commit('SET_PROVICECES', response.data)// 获取省列表
          resolve()
        }).catch(error => {
          console.log(error)
          console.log(error.code)
        })
      })
    }
  }
}
export default dict
