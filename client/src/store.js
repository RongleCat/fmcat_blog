import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    musicList: [],
    playIndex: 0,
    playing: true,
    asideClose: false,
    muteing: false
  },
  mutations: {
    setPlayIndex(state, index) {
      state.playIndex = index
    },
    setMusicList(state, list) {
      state.musicList = list
    },
    setPlayState(state, value) {
      state.playing = value
    },
    setMutedState(state, value) {
      state.muteing = value
    },
    setAsideClose(state, value) {
      state.asideClose = value
    }
  },
  getters: {
    getMusicBackground: (state) => {
      if (state.musicList.length) {
        return state.musicList[state.playIndex].bg_url
      } else {
        return ''
      }
    },
    getBackgroundSource: (state) => {
      if (state.musicList.length) {
        return state.musicList[state.playIndex].bg_source
      } else {
        return ''
      }
    },
    getMusicName: (state) => {
      if (state.musicList.length) {
        let {
          title,
          music_author
        } = state.musicList[state.playIndex]
        return title + ' - ' + music_author
      } else {
        return ''
      }
    }
  }
})