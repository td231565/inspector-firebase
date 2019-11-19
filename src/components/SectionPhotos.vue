<template>
  <section class="home__bottom__section home__bottom__section__photos">
    <h3>步驟3：請選擇或拍攝-現場查驗項目</h3>

    <PictureList :pictures="photos" @saveAllPhotoTextList="savePhotoListToVuex"/>
  </section>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
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
    ...mapMutations({
      updatePhotos: 'setPhotos'
    }),
    savePhotoListToVuex (data) {
      this.updatePhotos(data)
    }
  }
}
</script>

<style lang="sass" scoped>

</style>