<template>
  <div class="home">
    <StateBar />
    <Viewer />
    <StepBar />
    <component :is="stepNow" />
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
  }
}
</script>

<style lang="sass" scoped>
.home
  width: 75%
  height: 100%
  margin: auto
  padding: 10px
  background-color: $bg_default
  box-shadow: 0 0 1rem #000
  overflow: auto

// .viewer
//   width: 100%
//   height: 50vh
</style>