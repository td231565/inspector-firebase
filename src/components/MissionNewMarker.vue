<template>
  <div class="add absolute--top" ref="sectionAdd">
    <!-- 本次查驗目標圖片 -->
    <img :src="modelImage" alt="平面圖" ref="img">

    <div class="absolute--top" :class="{ add__cover: addStep !== 3}" ref="edit">
      <!-- 新增查驗點標記 -->
      <section class="add__section add__point" @click="addingNewMarker" v-if="addStep === 1">
        <h4 class="add__section__header">點擊圖片位置新增查驗點</h4>
      </section>

      <!-- 新增查驗點資訊 -->
      <section class="add__section add__form" v-else-if="addStep === 2">
        <NewMarkerForm @addMarkerInfo="addMarkerDataToDB" />
      </section>

      <!-- 新增查驗點註記 -->
      <section class="add__section add__annotation" v-if="addStep === 3">
        <img class="add__annotation__img" :src="annotatedImage">
      </section>

    </div>

  </div>
</template>

<script>
import { format } from 'date-fns'
import { mapState, mapActions, mapMutations } from 'vuex'
import { markersDB } from '../config/db'
import NewMarkerForm from './NewForm'
import { MarkerArea } from 'markerjs'
import SHA1 from '../config/sha'

export default {
  name: 'AddNewMarker',
  components: {
    NewMarkerForm
  },
  data () {
    return {
      addStep: 1,
      position: null,
      newMarkerId: '',
      annotatedImage: ''
    }
  },
  computed: {
    ...mapState({
      modelImage: state => state.modelState.modelImage,
      modelName: state => state.modelState.modelName,
      markerList: state => state.modelState.markerList,
    })
  },
  methods: {
    ...mapMutations({
      setSelectedMarkerData: 'setSelectedMarkerData'
    }),
    ...mapActions({
      getMarkerList: 'getMarkerList'
    }),
    addingNewMarker (e) {
      if (this.addStep !== 1) return
      this.position = {
        top: e.offsetY,
        left: e.offsetX
      }
      this.addStep = 2
    },
    createNewId () {
      let date = format(new Date(), 'yyyyMMdd')
      let time = format(new Date(), 'HH-mm-ss').split('-')
      let hour = time[0]
      let min = time[1]
      let sec = time[2]
      let stamp = new Date().valueOf()
      return `${date}h${hour}m${min}s${sec}-${stamp}`
    },
    addMarkerDataToDB (info) {
      let id = this.createNewId()
      let modelName = this.modelName
      this.newMarkerId = id
      info.point = [this.position.left, this.position.top]
      info.id = id

      markersDB.collection(modelName).doc(id).set(info)
      .then(() => {
        console.log('add marker success')
        this.addStep = 3
      }).catch(err => {
        console.log(err)
      })
    },
    // 設定 Mark.js 介面
    addAnnotationOnImage () {
      const img = this.$refs.img
      const sectionAdd = this.$refs.sectionAdd
      const edit = this.$refs.edit

      let markjs = new MarkerArea(img, {
        targetRoot: edit, // 移動 markjs 的根目錄DOM
        renderAtNaturalSize: true // 使用圖片原始尺寸
      })
      // markjs.toolbars = markjs.toolbars.slice(0, 9)
      markjs.show(dataUrl => {
        this.convertBase64ToPng(dataUrl)
      })

      // 調整 toolbar 位置
      let toolbar = sectionAdd.querySelector('.markerjs-toolbar')
      let position = {
        left: toolbar.offsetLeft,
        top: toolbar.offsetTop + 25,
      }
      toolbar.style.cssText = `position: absolute; left: ${position.left}px; top: ${position.top}px; z-index: 9;`
    },
    convertBase64ToPng (dataUrl) {
      let vm = this
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
          file: dataUrl, // 欲轉換的 base64 編碼
          api_key: '653999464428459',
          signature: SHA1(str) // 轉換後的 SHA1 字串
        })
      })
      .catch(err => console.log(err))
      .then(res => res.json())
      .then(res => {
        vm.annotatedImage = res.url
        vm.updateImgMarkedToDB()
      })
    },
    // 選擇新增好的任務 (查驗點)
    selectCurrentMarker (id) {
      this.markerList.map(marker => {
        if (marker.id === id) {
          this.setSelectedMarkerData(marker)
          this.$emit('finishAddingMarker')
        }
      })
    },
    // 更新標註圖片到DB
    updateImgMarkedToDB () {
      let modelName = this.modelName
      let image = this.annotatedImage
      let id = this.newMarkerId

      markersDB.collection(modelName).doc(id).set({ image }, { merge: true })
      .catch(err => console.log(err))
      .then(() => {
        console.log('new image')
        this.getMarkerList().then(() => {
          this.selectCurrentMarker(id)
        })
      })
    },
    resetAddStep () {
      this.addStep = 1
    }
  },
  watch: {
    addStep (val) {
      if (val === 3) this.addAnnotationOnImage()
    }
  },
  beforeDestroy () {
    this.resetAddStep()
  }
}
</script>

<style lang="sass" scoped>
.add
  &__cover
    width: 100%
    height: 100%
    background-color: $bg_cover_layer
    box-shadow: inset 0 0 50px #000
  &__section
    width: 100%
    height: 100%
    &__header
      color: #fff
  &__annotation
    text-align: center
    &__img
    &__toolbar
      display: flex
      z-index: 99
</style>