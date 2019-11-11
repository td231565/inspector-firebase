import Vue from 'vue'
import Vuex from 'vuex'
import { db } from '../config/db'

Vue.use(Vuex)

const userState = {
  state: {
    userAuth: null,
    userInfo: null
  },
  mutations: {
    setUserAuth (state, userAuth) {
      return state.userAuth = userAuth
    },
    setUserInfo (state, userInfo) {
      return state.userInfo = userInfo
    }
  },
  actions: {
    detectUserGroup ({ commit, state }) {
      let groups = ['adminGroup', 'userGroup']
      let uid = state.userAuth.uid
      groups.forEach(group => {
        db.collection(group).where('uid', '==', uid).get().then(docs => {
          if (docs.docs.length === 0) return
          docs.forEach(doc => commit('setUserInfo', doc.data()))
        })
      })
    }
  }
}

const modelState = {
  state: {
    modelPath: 'dxbim/fb8da11f09f542b4b344338aea29d771/83ce08590d0844ed8e171ae8a44a596f/1771ca6b1cc54dfb955fad322a23f23d.asm',
    modelName: ''
  },
  mutations: {
    setModelPath (state, modelPath) {
      return state.modelPath = modelPath
    },
    setModelName (state, modelName) {
      return state.modelName = modelName
    }
  },
  actions: {

  }
}

export default new Vuex.Store({
  modules: {
    userState,
    modelState
  }
})
