<template>
  <div class="home">
    <div class="home__top" ref="top">
      <StateBar />
      <!-- <Viewer /> -->
      <PdfViewer @pdfLoaded="detectTopHeight"/>
      <StepBar @stepPrev="stepPrev" @stepNext="stepNext" />
    </div>

    <div class="home__bottom" ref="bottom">
      <component :is="steps[stepNow-1]" @FromSon="getMsg" @toNextStep="toStep" />
    </div>

  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Viewer from '../components/HomeViewer.vue'
import PdfViewer from '../components/HomePdfViewer.vue'
import StateBar from '../components/HomeStateBar.vue'
import StepBar from '../components/HomeStepBar.vue'
import Missions from '../components/SectionMissions.vue'
import Plans from '../components/SectionPlans.vue'

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
      steps: [Missions, Plans],
      selectedMissionPlanList: [],
      selectedMissionPhotoList: [],
    }
  },
  methods: {
    detectTopHeight () {
      let topHeight = this.$refs.top.offsetHeight
      let bottom = this.$refs.bottom
      // console.log(topHeight)
      bottom.style.marginTop = topHeight + 'px'
    },
    getMsg (e) {
      console.log(e)
    },
    toStep (num) {
      this.getMarkerDataFromDB()
      this.stepNow = num
    },
    ...mapActions({
      getMarkerDataFromDB: 'getModelMarkersData'
    }),
    stepPrev () {
      return this.stepNow--
    },
    stepNext () {
      return this.stepNow++
    }
  }
}
</script>

<style lang="sass">
.home
  width: 60%
  height: 100%
  margin: auto
  padding: 10px
  padding-top: 0
  position: relative
  background-color: $bg_default
  box-shadow: 0 0 1rem #000
  overflow: hidden

  @include ae1100
    width: 75%
  @include ae768
    width: 100%

  &__top
    width: 100%
    // height: 50vh
    position: absolute
    top: 0
    left: 0
  &__bottom
    padding-top: 10px
    overflow: auto
</style>