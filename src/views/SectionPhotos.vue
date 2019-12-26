<template>
  <section class="home__bottom__section home__bottom__section__photos">
    <h3>步驟3：請選擇或拍攝-現場查驗項目</h3>

    <PictureList :pictures="photos"
      @uploadLocalPicture="uploadLocalPicture"
      @deletePicture="deletePicture"
      @updatePicture="updatePictureToPhoto" />
  </section>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import PictureList from '../components/PictureList'

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
      return this.selectedMarkerData.photos
    }
  },
  methods: {
    ...mapMutations({
      addPhoto: 'addPhotoToSelectedMarker',
      deletePhoto: 'deletePhotoFromSelectedMarker',
      updatePhoto: 'updatePhotoToSelectedMarker'
    }),
    uploadLocalPicture (data) {
      this.addPhoto(data)
    },
    deletePicture (index) {
      this.deletePhoto(index)
    },
    updatePictureToPhoto (data) {
      this.updatePhoto(data)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>