import GoogleMap from '~/plugins/GoogleMap.js'
export default {
  namespaced: true,
  state :() =>({
    mapLoading: false,
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
      console.log(`initGoogleMap`);
      commit('updateState', {mapLoading, payLoad})
    }
  }
}