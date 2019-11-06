import Vue from 'vue'
import Vuex from 'vuex'
import { db, fireAuth } from '../config/db'

Vue.use(Vuex)

export default new Vuex.Store({
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
    },
    watchUserState ({ commit, dispatch }) {
      return fireAuth.onAuthStateChanged(userAuth => {
        if (userAuth) {
          commit('setUserAuth', userAuth)
          dispatch('detectUserGroup')
        } else {
          commit('setUserAuth', null)
          commit('setUserInfo', null)
        }
      })
    }
  },
  modules: {
  }
})
