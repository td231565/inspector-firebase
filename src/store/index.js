import Vue from 'vue'
import Vuex from 'vuex'
import { db } from '../config/db'
import SHA1 from '../config/sha'

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
    modelName: 'gugci_d_22f',
    selectedMarker: '',
    selectedMarkerData: null,
    plans: [],
    photos: [],
  },
  mutations: {
    setModelPath (state, modelPath) {
      return state.modelPath = modelPath
    },
    setModelName (state, modelName) {
      return state.modelName = modelName
    },
    setSelectedMarker (state, selectedMarkerId) {
      return state.selectedMarker = selectedMarkerId
    },
    setSelectedMarkerData (state, data) {
      return state.selectedMarkerData = data
    },
    setPlans (state, data) {
      return state.plans = data
    },
    setPhotos (state, data) {
      return state.photos = data
    }
  },
  actions: {
    getModelMarkersData ({ state, commit }) {
      // console.log(state.selectedMarker)
      let modelName = state.modelName
      let markerId = state.selectedMarker
      db.collection('markersData').doc('gugci_d')
        .collection(modelName).doc(markerId).get().then(doc => {
          let docData = doc.data()
          commit('setSelectedMarkerData', docData)
          // console.log(state.selectedMarkerData)
        })
    },
    updateModelMarkersData ({ state }) {
      let modelName = state.modelName
      let markerId = state.selectedMarker
      db.collection('markersData').doc('gugci_d')
        .collection(modelName).doc(markerId).set({
          accompany: '',
          camera: '',
          category: '',
          creator: '',
          date: '',
          floor: '',
          image: '',
          inspector: '',
          issue: '',
          name: '',
          photos: state.uploadPhoto,
          plans: state.uploadPlan,
          point: [],
          problem: '',
          selfCheckState: '',
          status: ''
        }, { merge: true }).then(() => {

        })
    },
    // 上傳圖片到雲端: 使用第三方服務 Cloudinary
    uploadImgToServer ({ commit }, data) {
      if (data[0].match('base64')) {
        let timestamp = Math.floor(Date.now() / 1000)
        let api_secret = 'yynjtJYNqqHy2XWvBh7x4taVNjI'
        let str = `timestamp=${timestamp}${api_secret}` // 規定最後須加上 api_secret
        // 將 base64:image 上傳到 cloudinary 轉換成真正的圖片
        return fetch('https://api.cloudinary.com/v1_1/ctcimage/image/upload', {
          method: 'POST',
          headers: new Headers({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({
            timestamp: timestamp, // 時間戳記 required
            file: data[0], // 欲轉換的 base64 編碼
            api_key: '653999464428459',
            signature: SHA1(str) // 轉換後的 SHA1 字串
          })
        })
        .catch(err => console.log(err))
        .then(res => res.json())
        .then(res => {
          console.log('image uploaded: ' + res.url)
          commit('setUploadPlan', [res.url, data[1]])
        })
      } else {
        commit('setUploadPlan', data)
      }
    }
  }
}

const systemState = {
  state: {
    choosedPhoto: ''
  },
  mutations: {
    setChoosedPhoto (state, img) {
      return state.choosedPhoto = img
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
