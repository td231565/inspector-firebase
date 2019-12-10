<template>
  <div class="pdfviewer">
    <div class="pdfviewer__imgLayer">
      <!-- 原圖: 未選擇查驗點 或 此查驗點沒有標註圖片 -->
      <img class="pdfviewer__imgLayer__img" :src="img" :alt="missionImgName"
        v-if="!selectedMarkerData || !selectedMarkerData.image">

      <!-- 標記圖層: 放置各查驗點的標記 -->
      <div class="pdfviewer__imgLayer__markersLayer absolute--top" v-if="isPdfLoaded && stepNow === 1">
        <MarkerItem v-for="(mark, index) in markerList" :key="index+1"
          :mark="mark" @stepNext="stepNext" />
      </div>

      <!-- 標註過的圖片(annotated): 顯示此查驗點中標註過的圖片 -->
      <img class="pdfviewer__imgLayer__img" :src="missionImg" :alt="missionImgName"
        v-if="stepNow !== 1 && selectedMarkerData">
    </div>

    <!-- pdfjs: 負責轉換 PDF to PNG -->
    <pdf class="pdfviewer__pdf" :src="modelPath" ref="pdf" v-show="!isPdfLoaded"></pdf>

    <!-- 增加新查驗點 -->
    <AddNewMarker v-if="isAddNewMarker" @finishAddingMarker="finishAddingMarker" />
  </div>
</template>

<script>
import pdf from 'vue-pdf'
import AddNewMarker from './MissionNewMarker'
import MarkerItem from './MarkersItem'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'HomePdfViewer',
  components: {
    pdf,
    AddNewMarker,
    MarkerItem
  },
  props: {
    stepNow: Number,
  },
  data () {
    return {
      isPdfLoaded: false,
      img: '',
    }
  },
  computed: {
    ...mapState({
      modelName: state => state.modelState.modelName,
      modelPath: state => state.modelState.modelPath,
      markerList: state => state.modelState.markerList,
      selectedMarkerData: state => state.modelState.selectedMarkerData,
      isAddNewMarker: state => state.systemState.isAddNewMarker,
    }),
    missionImg () {
      return (this.selectedMarkerData) ? this.selectedMarkerData.image : ''
    },
    missionImgName () {
      return (this.selectedMarkerData) ? this.selectedMarkerData.name + '平面圖' : ''
    }
  },
  methods: {
    ...mapMutations({
      setModelImage: 'setModelImage',
      addingNewMarker: 'addingNewMarker',
      // setSelectedMarker: 'setSelectedMarker'
    }),
    pageLoaded () {
      this.img = document.querySelector('canvas').toDataURL()
      this.setModelImage(this.img)
      this.isPdfLoaded = true
      this.$emit('pdfLoaded')
    },
    stepNext () {
      this.$emit('stepNext')
    },
    finishAddingMarker () {
      this.addingNewMarker(false)
      this.stepNext()
    }
  },
  mounted () {
    let vm = this
    pdf.createLoadingTask(this.modelPath).then(() => {
      // console.log(data.numPages)
      vm.pageLoaded()
    })
  }
}
</script>

<style lang="sass" scoped>
.pdfviewer
  max-height: 45vh
  position: relative
  overflow: auto
  z-index: -1
  &__pdf
    width: 100%
    // max-height: 45vh

    @include ae768
      max-height: 40vh
  &__imgLayer
    position: relative
    &__img
      width: 100%
    &__markersLayer
      width: 100%
      height: 100%
      background-color: rgba(orange, 0.1)
</style>