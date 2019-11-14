<template>
  <li class="photos__item">
    <div class="photos__item__block photos__item__block--picture flex--center">
      <img :src="photoImg" alt="">
      <button class="btn btn__delete" title="刪除圖片"></button>
    </div>
    <textarea class="photos__item__text" placeholder="請輸入抽查意見"
      v-model="photoText"></textarea>
  </li>
</template>

<script>
export default {
  name: 'PhotoItem',
  props: {
    photo: String
  },
  data () {
    return {
      photoImg: '',
      photoText: ''
    }
  },
  computed: {
    combinePhotoText () {
      return [this.photoImg, this.photoText]
    }
  },
  methods: {
    loadPhoto () {
      if (!this.photo) return

      let photo = this.photo
      if (photo.match('base64')) {
        this.photoImg = photo
        this.photoText = ''
      } else {
        this.photoImg = photo.split(';')[0]
        this.photoText = photo.split(';')[1]
      }
    }
  },
  mounted () {
    this.loadPhoto()
  },
  beforeDestroy () {
    this.$emit('uploadPlanArray', this.combinePhotoText)
  }
}
</script>

<style lang="sass" scoped>

</style>