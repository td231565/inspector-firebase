import Vue from 'vue'
import Vuex from 'vuex'
import { db, markersDB } from '../config/db'
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
    selectedMarkerImage: '',
    selectedMarkerData: null,
    plans: [],
    photos: [],
    isMarkerUpdated: null,
    isAddNewMarker: false,
    // 新的資料流向: 把所有任務都放在 vuex，再從這裡拿
    markerList: []
    // 每次新增任務，還是單獨進行，判斷圖片是否轉檔，更新到DB
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
    setSelectedMarkerImage (state, image) {
      return state.selectedMarkerImage = image
    },
    // 選擇 marker (查驗點)
    setSelectedMarkerData (state, data) {
      // 沒有選擇任務時，傳入空值
      if (!data) {
        state.selectedMarkerData = null
      } else {
        // 選擇任務後，先將字串轉成陣列
        ['plans', 'photos'].forEach(picArray => {
          data[picArray] = data[picArray].map(item => {
            return item = item.split(';')
          })
        })
        state.selectedMarkerData = data
      }
    },
    // 控制圖片新增/移除/更新 (還在本地端)
    addPlanToSelectedMarker (state, pictureItem) {
      state.selectedMarkerData.plans.push(pictureItem)
    },
    addPhotoToSelectedMarker (state, pictureItem) {
      state.selectedMarkerData.photos.push(pictureItem)
    },
    deletePlanFromSelectedMarker (state, index) {
      state.selectedMarkerData.plans.splice(index, 1)
    },
    deletePhotoFromSelectedMarker (state, index) {
      state.selectedMarkerData.photos.splice(index, 1)
    },
    updatePlanToSelectedMarker (state, data) {
      let index = data.index
      let pictureItem = data.item
      state.selectedMarkerData.plans.splice(index, 1, pictureItem)
    },
    updatePhotoToSelectedMarker (state, data) {
      let index = data.index
      let pictureItem = data.item
      state.selectedMarkerData.photos.splice(index, 1, pictureItem)
    },
    // 圖片文字整合成字串 (給Firebase的格式)
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
    getMarkerList ({ state, commit }) {
      commit('resetMarkerList')

      let modelName = state.modelName
      markersDB.collection(modelName).get()
      .then(docs => {
        docs.forEach(doc => {
          if (doc.id === 'modelInfo') return
          let docData = doc.data()
          docData['id'] = doc.id
          commit('setMarkerList', docData)
        })
      })
    },
    updateModelMarkersData ({ state, commit }) {
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

      let isAllImgConverted = checkImgConvert()
      if (!isAllImgConverted) return

      // 上傳資料至 DB
      let data = state.selectedMarkerData
      data['plans'] = state.plans
      data['photos'] = state.photos

      let modelName = state.modelName
      let markerId = data.id

      markersDB.collection(modelName).doc(markerId)
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
      if (state.plans.length === 0 && state.photos.length === 0) {
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
        data['url'] = res.url
        commit('setUploadPictureToArray', data)
      })
      .then(() => {
        dispatch('updateModelMarkersData')
      })
    }
  }
}

export default new Vuex.Store({
  modules: {
    userState,
    modelState
  }
})
