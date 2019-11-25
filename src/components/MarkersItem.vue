<template>
  <div class="markerItem absolute--top" ref="mark">
    <img class="markerItem__img" src="../assets/camera_marker.png" alt="">
    <p class="markerItem__text">{{ mark.name }}</p>
  </div>
</template>

<script>
export default {
  name: 'MarkerItem',
  props: {
    mark: Object
  },
  methods: {
    setMarkerPoint () {
      let mark = this.$refs.mark
      let [ left, top ] = this.mark.point
      mark.style.cssText = `left: ${left}; top: ${top};`
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
  border: 1px solid red
  &__img
    width: 28px
    height: 28px
    margin: 0
    // display: block
  &__text
    margin: 0
</style>