<template>
  <ul class="photos">
    <li class="photos__item">
      <div class="photos__item__block">
        <label for="pictureUpload" class=" photos__item__block__camera absolute--center">
          <input type="file" id="pictureUpload" accept="image/*" @change="handelLocalFileUpload">
        </label>
      </div>
    </li>
    <!-- insert new itemBox -->
    <PictureItem v-for="(picture, index) in pictures"
      :key="index+1"
      :picture="picture"
      :index="index"
      @updatePhotoText="updatePicture"
      @deletePicture="deletePicture" />
  </ul>
</template>

<script>
import { mapState } from 'vuex'
import PictureItem from './PictureItem'

export default {
  name: 'pictureList',
  components: {
    PictureItem
  },
  props: {
    pictures: Array
  },
  data () {
    return {

    }
  },
  computed: {
    ...mapState({
      selectedMarkerData: state => state.modelState.selectedMarkerData
    })
  },
  methods: {
    // 處理本機上傳圖片
    handelLocalFileUpload (e) {
      let file = e.target.files[0]
      if (!file) return

      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = ev => {
        let img = [ev.target.result, '']
        this.$emit('uploadLocalPicture', img)
      }
    },
    updatePicture (data) {
      this.$emit('updatePicture', data)
    },
    deletePicture (index) {
      console.log('index: ' + index)
      this.$emit('deletePicture', index)
    }
  }
}
</script>

<style lang="sass">
.photos
  width: 100%
  // margin: auto
  padding: 0 2rem
  display: flex
  flex-wrap: wrap
  &__item
    width: 31%
    height: auto
    margin: 0 1%
    &__block
      width: 100%
      // height: 200px
      // padding: 0
      padding-top: 75%
      position: relative
      background-color: rgba(#000, 0.1)
      border: 1px solid $bd_input_default
      border-radius: 10px
      overflow: hidden
      cursor: pointer
      opacity: 0.7
      &:hover
        opacity: 1

      @include ae768
        // height: 100px
        opacity: 1

      &__camera
        width: 100%
        height: 100%
        display: block
        cursor: pointer
        // 相機圖案
        &::after
          width: 4rem
          height: 4rem
          @extend .pseudo
          @extend .absolute--center
          background-image: url('~@/assets/camera.svg')
          background-size: cover

#pictureUpload
  width: 1px
  height: 1px
</style>