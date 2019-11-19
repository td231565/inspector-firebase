<template>
  <li class="photos__item">
    <div class="photos__item__block photos__item__block--picture flex--center" @click="choosePhoto">
      <img class="photos__item__block__img" :src="pictureImg" alt="">
      <button class="btn btn__delete" title="刪除圖片"></button>
    </div>
    <textarea class="photos__item__text" placeholder="請輸入抽查意見"
      v-model="pictureText"></textarea>
  </li>
</template>

<script>
export default {
  name: 'PhotoItem',
  props: {
    picture: String
  },
  data () {
    return {
      pictureImg: '',
      pictureText: ''
    }
  },
  computed: {
    combinePhotoText () {
      return [this.pictureImg, this.pictureText]
    }
  },
  methods: {
    loadPicture () {
      if (!this.picture) return

      let picture = this.picture
      let isBase64 = picture.match('base64')
      // console.log(isBase64)
      this.pictureImg = (isBase64) ? picture : picture.split(';')[0]
      this.pictureText = (isBase64) ? '' : picture.split(';')[1]
    },
    choosePhoto (e) {
      if (e.target.className.match('btn__delete')) return
      this.$store.commit('setChoosedPhoto', this.pictureImg)
    },
    savePhotoText () {
      this.$emit('savePhotoText', this.combinePhotoText)
    }
  },
  mounted () {
    this.loadPicture()
  },
  deactivated () {
    this.savePhotoText()
  }
}
</script>

<style lang="sass" scoped>
.photos
  &__item
    &__block
      &--picture
        flex-wrap: wrap
        img
          max-width: 100%
          display: block // 消除 img 底部與 div 間的空白
        .btn__delete
          position: absolute
          top: 5px
          right: 5px
    &__text
      width: 100%
      height: 60px
      margin-top: 8px
      padding: 6px
      border-radius: 10px
</style>