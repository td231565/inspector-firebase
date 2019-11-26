<template>
  <ul class="photos">
    <li class="photos__item">
      <label for="pictureUpload" class="photos__item__block photos__item__block--camera">
        <input type="file" id="pictureUpload" accept="image/*" multiple @change="handelFileUploadFromLocal">
      </label>
    </li>
    <!-- insert new itemBox -->
    <PictureItem v-for="(picture, index) in pictures"
      :key="index+1"
      :picture="picture"
      @savePhotoText="saveToList"
      @deletePicture="deleteExistPicture" />
    <PictureItem v-for="(img, index) in imgUploadList"
      :key="index+20"
      :picture="img"
      @savePhotoText="saveToList"
      @deletePicture="deleteUploadPicture" />
  </ul>
</template>

<script>
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
      imgUploadList: [],
      allPhotoTextList: []
    }
  },
  computed: {

  },
  methods: {
    // 處理本機上傳圖片
    handelFileUploadFromLocal (e) {
      let file = e.target.files[0]
      if (!file) return

      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = ev => {
        let uploadImg = ev.target.result
        this.imgUploadList.push(uploadImg)
      }
    },
    clearExistList () {
      this.allPhotoTextList = []
    },
    saveToList (combinedPhotoText) {
      this.allPhotoTextList.push(combinedPhotoText)
    },
    saveAllPhotoTextList () {
      this.$emit('saveAllPhotoTextList', this.allPhotoTextList)
    },
    deleteUploadPicture (imgUrl) {
      let index = this.imgUploadList.indexOf(imgUrl)
      this.imgUploadList.splice(index, 1)
    },
    deleteExistPicture (imgUrl) {
      let index = this.pictures.indexOf(imgUrl)
      this.pictures.splice(index, 1)
    }
  },
  activated () {
    this.clearExistList()
  },
  deactivated () {
    this.saveAllPhotoTextList()
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
    margin: 0.4%
    &__block
      width: 100%
      height: 200px
      padding: 0
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
        height: 100px
        opacity: 1

      &--camera
        display: block
        // 相機圖案
        &::after
          width: 4rem
          height: 4rem
          @extend .pseudo
          @extend .absolute--center
          background-image: url('~@/assets/camera.svg')
          background-size: cover
</style>