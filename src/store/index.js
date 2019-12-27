import Vue from 'vue'
import Vuex from 'vuex'
import { db, markersDB } from '../config/db'

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
    modelPath: 'https://firebasestorage.googleapis.com/v0/b/sme-markers-data-demo.appspot.com/o/test_plan_C.pdf?alt=media&token=8b074837-e93b-4cc2-8a3e-0a6dadc8e9aa',
    modelName: 'gugci_d_t_flat',
    modelImage: '',
    selectedMarkerData: null,
    // 依 Firestore 回傳值，確定上傳成功/失敗
    isMarkerUpdated: null,
    // 新的資料流向: 把所有任務都放在 vuex，再從這裡拿
    markerList: []
  },
  getters: {
    modelName (state) {
      return state.modelName
    }
  },
  mutations: {
    // 選擇模型 (查驗項目)
    setModelPath (state, modelPath) {
      return state.modelPath = modelPath
    },
    setModelName (state, modelName) {
      return state.modelName = modelName
    },
    // 儲存 markers (查驗點)
    setMarkerList (state, item) {
      return state.markerList.push(item)
    },
    resetMarkerList (state) {
      return state.markerList = []
    },
    setModelImage (state, image) {
      return state.modelImage = image
    },
    // 選擇 marker (查驗點)
    setSelectedMarkerData (state, data) {
      // 沒有選擇任務時，傳入空值
      return state.selectedMarkerData = (!data) ? null : data
    },
    // 新增/移除/更新圖片 (還在本地端)
    addPlanToSelectedMarker (state, pictureItem) {
      return state.selectedMarkerData.plans.push(pictureItem)
    },
    addPhotoToSelectedMarker (state, pictureItem) {
      return state.selectedMarkerData.photos.push(pictureItem)
    },
    deletePlanFromSelectedMarker (state, index) {
      console.log(state.selectedMarkerData.plans[index])
      return state.selectedMarkerData.plans.splice(index, 1)
    },
    deletePhotoFromSelectedMarker (state, index) {
      console.log(state.selectedMarkerData.photos[index])
      return state.selectedMarkerData.photos.splice(index, 1)
    },
    updatePlanToSelectedMarker (state, data) {
      let index = data.index
      let pictureItem = data.item
      return state.selectedMarkerData.plans.splice(index, 1, pictureItem)
    },
    updatePhotoToSelectedMarker (state, data) {
      let index = data.index
      let pictureItem = data.item
      return state.selectedMarkerData.photos.splice(index, 1, pictureItem)
    },
    setMarkerUpdated (state, boolean) {
      return state.isMarkerUpdated = boolean
    }
  },
  actions: {
    getMarkerList ({ state, commit }) {
      let modelName = state.modelName

      return markersDB.collection(modelName).get()
      .then(docs => {
        commit('resetMarkerList')
        docs.forEach(doc => {
          if (doc.id === 'modelInfo') return
          let docData = doc.data()
          // 先將任務資料中的字串轉成陣列
          ;['plans', 'photos'].forEach(picArray => {
            docData[picArray] = docData[picArray].map(item => {
              return item = item.split(';')
            })
          })
          commit('setMarkerList', docData)
        })
      })
    }
  }
}

const systemState = {
  state: {
    isLoading: false,
    isAddNewMarker: false
  },
  mutations: {
    setLoading (state, boolean) {
      state.isLoading = boolean
    },
    addingNewMarker (state, boolean) {
      return state.isAddNewMarker = boolean
    }
  }
}

export default new Vuex.Store({
  modules: {
    userState,
    modelState,
    systemState
  }
})
