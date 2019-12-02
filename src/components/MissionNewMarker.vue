<template>
  <div class="add absolute--top" ref="sectionAdd">
    <!-- 本次查驗目標圖片 -->
    <img :src="selectedMarkerImage" alt="平面圖" ref="img">

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
        <img class="add__annotation__img" :src="imgMarkedDataUrl">
      </section>

    </div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
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
      imgMarkedDataUrl: ''
    }
  },
  computed: {
    ...mapState({
      selectedMarkerImage: state => state.modelState.selectedMarkerImage,
      modelName: state => state.modelState.modelName
    })
  },
  methods: {
    addingNewMarker (e) {
      if (this.addStep !== 1) return
      this.position = {
        top: e.offsetY,
        left: e.offsetX
      }
      this.addStep = 2
    },
    addMarkerDataToDB (info) {
      info.point = [this.position.left, this.position.top]
      markersDB.collection(this.modelName).add(info)
      .then(res => {
        console.log('add marker success')
        this.addStep = 3
        this.newMarkerId = res.id
      }).catch(err => {
        console.log(err.code)
      })
    },
    addMarkerCoverImageToDB () {

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
      .then(res => vm.imgMarkedDataUrl = res.url)
    },
    updateImgMarkedToDB () {
      let vm = this
      markersDB.collection(this.modelName).doc(this.newMarkerId).set({
        image: vm.imgMarkedDataUrl
      }, { merge: true }).then(() => {
        console.log('new image')
        this.$emit('finishAddingMarker', vm.newMarkerId)
      }).catch(err => {
        console.log(err.code)
      })
    },
    resetAddStep () {
      this.addStep = 1
    }
  },
  watch: {
    addStep (val) {
      if (val === 3) this.addAnnotationOnImage()
    },
    imgMarkedDataUrl (val) {
      if (!val) return
      if (val.match('base64')) return
      this.updateImgMarkedToDB()
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