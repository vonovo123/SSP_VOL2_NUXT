export default {
  namespaced: true,
  state :() =>({
    coords: null
  }),
  getters:{},
  mutations : {
    updateState(state, payLoad){
      Object.entries(payLoad).forEach(([key, value]) => {
        state[key] = value;
      })
    }
  },
  actions:{
    initDataMap({state, commit},payLoad){
      commit('updateState', payLoad)
      this.$router.push('/regist')
    }
  }
}