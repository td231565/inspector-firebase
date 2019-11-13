<template>
  <div class="home">
    <div class="home__top" ref="top">
      <StateBar />
      <Viewer />
      <StepBar />
    </div>

    <div class="home__bottom" ref="bottom">
      <component :is="stepNow" />
    </div>

  </div>
</template>

<script>
import Viewer from '../components/HomeViewer.vue'
import StateBar from '../components/HomeStateBar.vue'
import StepBar from '../components/HomeStepBar.vue'
import Missions from '../components/HomeMissions.vue'

export default {
  name: 'home',
  data () {
    return {
      stepNow: Missions
    }
  },
  components: {
    Viewer,
    StateBar,
    StepBar
  },
  methods: {
    detectTopHeight () {
      let topHeight = this.$refs.top.offsetHeight
      let bottom = this.$refs.bottom
      bottom.style.marginTop = topHeight + 'px'
    }
  },
  mounted () {
    this.detectTopHeight()
  }
}
</script>

<style lang="sass" scoped>
.home
  width: 75%
  height: 100%
  margin: auto
  padding: 10px
  padding-top: 0
  position: relative
  background-color: $bg_default
  box-shadow: 0 0 1rem #000
  overflow: hidden
  &__top
    width: 100%
    position: absolute
    top: 0
    left: 0
  &__bottom
    padding-top: 10px
    overflow: auto
</style>