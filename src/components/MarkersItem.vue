<template>
  <div class="markerItem absolute--top" ref="mark" @click="selectMission(mark.id)">
    <img class="markerItem__img" src="../assets/camera_marker.png" alt="">
    <p class="markerItem__text">{{ mark.name }}</p>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'MarkerItem',
  props: {
    mark: Object
  },
  // computed: {
  //   ...mapState({
  //     selectedMarkerData: state => state.modelState.selectedMarkerData
  //   })
  // },
  methods: {
    setMarkerPoint () {
      let markObj = this.$refs.mark
      let [left, top] = this.mark.point
      let leftFixed = left - markObj.offsetWidth/2
      markObj.style.cssText = `left: ${leftFixed}px; top: ${top}px;`
    },
    ...mapMutations({
      setSelectedMarker: 'setSelectedMarker',
      setSelectedMarkerImage: 'setSelectedMarkerImage'
    }),
    selectMission (id) {
      this.setSelectedMarker(id)
      // this.setSelectedMarkerImage(this.selectedMarkerData.image)
      this.$emit('stepNext')
    }
  },
  mounted () {
    this.setMarkerPoint()
  }
}
</script>

<style lang="sass" scoped>
.markerItem
  max-width: 100px
  // height: auto
  margin: 0
  padding: 0
  text-align: center
  // border: 1px solid red
  &__img
    width: 28px
    height: 28px
    margin: 0
    cursor: pointer
    // display: block
  &__text
    margin: 0
    padding: 2px 4px
    font-size: 0.8rem
    background-color: rgba(#fff, 0.8)
    cursor: pointer
</style>