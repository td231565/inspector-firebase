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
    modelPath: 'https://firebasestorage.googleapis.com/v0/b/sme-markers-data-demo.appspot.com/o/test_plan_C.pdf?alt=media&token=8b074837-e93b-4cc2-8a3e-0a6dadc8e9aa',
    modelName: 'gugci_d_22f_flat',
    selectedMarker: '',
    selectedMarkerImage: '',
    selectedMarkerData: null,
    plans: [],
    photos: [],
    isMarkerUpdated: null,
    isAddNewMarker: false
  },
  mutations: {
    setModelPath (state, modelPath) {
      return state.modelPath = modelPath
    },
    setModelName (state, modelName) {
      return state.modelName = modelName
    },
    setSelectedMarkerImage (state, image) {
      return state.selectedMarkerImage = image
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
    },
    setUploadPictureToArray (state, data) {
      // console.log(data)
      state[data.picArray][data.index] = data.url + ';' + data.text
    },
    setMarkerUpdated (state, boolean) {
      return state.isMarkerUpdated = boolean
    },
    addingNewMarker (state, boolean) {
      return state.isAddNewMarker = boolean
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
    updateModelMarkersData ({ state, commit }) {
      let isAllImgConverted = checkImgConvert()
      // 確認圖片是否皆已處理完畢
      function checkImgConvert () {
        let check = true
        ;['plans', 'photos'].forEach(picArray => {
          state[picArray].forEach(item => {
            let itemType = typeof(item)
            if (itemType.toString().toLowerCase() === 'object') check = false
          })
        })
        return check
      }
      if (!isAllImgConverted) return

      // 上傳資料至 DB
      let data = state.selectedMarkerData
      data.plans = state.plans
      data.photos = state.photos
      // console.log(data)

      let modelName = state.modelName
      let markerId = state.selectedMarker

      db.collection('markersData').doc('gugci_d')
        .collection(modelName).doc(markerId)
        .set(data, { merge: true }).then(() => {
          console.log('update data to DB success')
          commit('setMarkerUpdated', true)
        }).catch(err => {
          console.log(err.code)
          commit('setMarkerUpdated', false)
        })
    },
    // 確認圖片是否已上傳 server (Cloudinary)
    checkPictureConvert ({ state, dispatch, commit}) {
      if (state['plans'].length === 0 && state['photos'].length === 0) {
        // 都沒有圖片直接跳下個步驟
        dispatch('updateModelMarkersData')
      } else {
        ['plans', 'photos'].forEach(picArray => {
          if (state[picArray].length !== 0) {
            state[picArray].forEach((item, index) => {
              let [imgUrl, imgText] = item
              let payload = {
                picArray,
                index,
                url: imgUrl,
                text: imgText
              }

              if (imgUrl.match('base64')) {
                dispatch('uploadImgToServer', payload)
              } else {
                commit('setUploadPictureToArray',payload)
                dispatch('updateModelMarkersData')
              }
            })
          }
        })
      }
    },
    // 上傳圖片到雲端: 使用第三方服務 Cloudinary
    uploadImgToServer ({ commit, dispatch }, data) {
      let timestamp = Math.floor(Date.now() / 1000)
      let api_secret = 'yynjtJYNqqHy2XWvBh7x4taVNjI'
      let str = `timestamp=${timestamp}${api_secret}` // 規定最後須加上 api_secret
      // 將 base64:image 上傳到 cloudinary 轉換成實體圖片
      return fetch('https://api.cloudinary.com/v1_1/ctcimage/image/upload', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          timestamp: timestamp, // 時間戳記 required
          file: data.url, // 欲轉換的 base64 編碼
          api_key: '653999464428459',
          signature: SHA1(str) // 轉換後的 SHA1 字串
        })
      })
      .catch(err => console.log(err))
      .then(res => res.json())
      .then(res => {
        let payload = {
          picArray: data.picArray,
          index: data.index,
          url: res.url,
          text: data.text
        }
        // console.log('image uploaded: ' + res.url)
        commit('setUploadPictureToArray', payload)
      }).then(() => {
        dispatch('updateModelMarkersData')
      })
    }
  }
}

const systemState = {
  state: {
    choosedPhoto: '',
    // stepNow: 1
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
