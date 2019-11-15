<template>
  <section class="home__bottom__section photos">
    <h3>步驟3：請選擇或拍攝-現場查驗項目</h3>

    <PictureList :pictures="photos"/>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import PictureList from './PictureList'

export default {
  name: 'SectionPhotos',
  components: {
    PictureList
  },
  data () {
    return {

    }
  },
  computed: {
    ...mapState({
      selectedMarkerData: state => state.modelState.selectedMarkerData
    }),
    photos () {
      if (!this.selectedMarkerData) return
      return this.selectedMarkerData.photos
    }
  },
  methods: {

  }
}
</script>

<style lang="sass" scoped>

</style>