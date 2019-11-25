<template>
  <div class="home">
    <div class="home__top" ref="top">
      <StateBar />
      <!-- <Viewer /> -->
      <PdfViewer :stepNow="stepNow" :isAddNewMarker="isAddNewMarker"
        @pdfLoaded="detectTopHeight" @stepNext="stepNext"/>
      <StepBar :stepNow="stepNow"
        @stepPrev="stepPrev" @stepNext="stepNext" @stepToFirst="stepToFirst" />
    </div>

    <div class="home__bottom" ref="bottom">
      <keep-alive :include="aliveInclude">
        <component :is="steps[stepNow-1]" @stepNext="stepNext" @stepToFirst="stepToFirst" />
      </keep-alive>
    </div>

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Viewer from '../components/HomeViewer.vue'
import PdfViewer from '../components/HomePdfViewer.vue'
import StateBar from '../components/HomeStateBar.vue'
import StepBar from '../components/HomeStepBar.vue'
import Missions from '../components/SectionMissions.vue'
import Plans from '../components/SectionPlans.vue'
import Photos from '../components/SectionPhotos.vue'
import Form from '../components/SectionForm.vue'

export default {
  name: 'home',
  components: {
    Viewer,
    PdfViewer,
    StateBar,
    StepBar
  },
  data () {
    return {
      stepNow: 1,
      steps: [Missions, Plans, Photos, Form],
    }
  },
  computed: {
    aliveInclude () {
      let cachedSteps = (this.stepNow === 1) ? [] : this.steps.filter((step, index) => index !== 0)
      return cachedSteps.map(component => component.name)
    },
    ...mapState({
      isAddNewMarker: state => state.modelState.isAddNewMarker
    })
  },
  methods: {
    detectTopHeight () {
      let topHeight = this.$refs.top.offsetHeight
      let bottom = this.$refs.bottom
      // console.log(topHeight)
      bottom.style.paddingTop = topHeight + 'px'
    },
    ...mapActions({
      getMarkerDataFromDB: 'getModelMarkersData'
    }),
    stepPrev () {
      if (this.stepNow === 1) return
      return this.stepNow--
    },
    stepNext () {
      if (this.stepNow === this.steps.length) return
      if (this.stepNow === 1) this.getMarkerDataFromDB()
      return this.stepNow++
    },
    stepToFirst () {
      return this.stepNow = 1
    }
  }
}
</script>

<style lang="sass">
.home
  width: 60%
  height: 100%
  margin: auto
  padding: 0 10px
  position: relative
  background-color: $bg_default
  box-shadow: 0 0 1rem #000
  // overflow: auto

  @include ae1100
    width: 75%
  @include ae768
    width: 100%

  // TODO: 手機版面，改成兩個頁面切換？

  &__top
    width: 100%
    min-height: 40vh
    position: absolute
    top: 0
    left: 0
    background-color: $bg_default
    z-index: 1

  &__bottom
    height: 100%
    padding-top: 10px
    overflow: auto

.viewerLayer
  position: relative
</style>