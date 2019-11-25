<template>
  <div class="add absolute--top">
    <img :src="selectedMarkerImage" alt="平面圖" ref="img">

    <div class="add__cover absolute--top" @click="addingNewMarker" v-if="addStep !== 3">
      <section class="add__section add__point" v-if="addStep === 1">
        <h4 class="add__section__header">點擊圖片位置新增查驗點</h4>
      </section>

      <section class="add__section add__form" v-else-if="addStep === 2">
        <NewMarkerForm @addMarkerInfo="addMarkerDataToDB" />
      </section>
    </div>

    <section class="add__section add__annotation" v-if="addStep === 3">
      <img class="add__annotation__img absolute--top" ref="imgMarked" :src="imgMarkedDataUrl">
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { markersDB } from '../config/db'
import NewMarkerForm from './NewForm'
import { MarkerArea } from 'markerjs'

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
    addAnnotationOnImage () {
      let img = this.$refs.img
      let markjs = new MarkerArea(img, {
        renderAtNaturalSize: true
      })
      markjs.show(dataUrl => {
        // vmRefs.imgMarked.src = dataUrl
        this.imgMarkedDataUrl = dataUrl
      })

      // 調整 toolbar 位置
      let toolbar = document.querySelector('.markerjs-toolbar')
      let position = {
        left: toolbar.offsetLeft,
        top: toolbar.offsetTop + 25,
      }
      toolbar.style.cssText = `position: absolute; left: ${position.left}px; top: ${position.top}px; z-index: 9;`

      // 調整 annotation layer 到畫面最上層
      let annoLayer = null
      let allDivs = document.querySelectorAll('div')
      allDivs.forEach(div => {
        if (div.style.transformOrigin === 'left top') {
          annoLayer = div
          annoLayer.style.zIndex = 9
        }
      })
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
      console.log(val)
      if (val === 3) this.addAnnotationOnImage()
    },
    imgMarkedDataUrl (val) {
      if (!val) return

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
    &__header
      color: #fff

  &__annotation
    &__img
</style>