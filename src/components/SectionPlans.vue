<template>
  <section class="home__bottom__section plans">
    <h3>步驟2：請選擇或拍攝-施工圖</h3>
    
    <ul class="plans__photos">
      <li class="plans__photos__item">
        <label for="planUpload" class="plans__photos__item__block plans__photos__item__block--camera">
          <input type="file" accept="image/*" multiple @change="handelFileUploadFromLocal">
        </label>
      </li>
      <!-- insert new itemBox -->
      <li class="plans__photos__item">
        <div class="plans__photos__item__block plans__photos__item__block--picture flex--center">
          <img src="" alt="">
          <button class="btn btn__delete" title="刪除圖片"></button>
        </div>
        <textarea class="plans__photos__item__text" placeholder="請輸入抽查意見"></textarea>
      </li>
    </ul>
  </section>
</template>

<script>
import { markersDB } from '../config/db'

export default {
  data () {
    return {
      file: ''
    }
  },
  methods: {
    // 處理本機上傳圖片
    handelFileUploadFromLocal (e) {
      console.log(e)
      let file = e.target.files[0]
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = ev => {
        console.log(ev.target.result)
      }
    },
    // 將截圖產生成圖片 (Cloudinary)
    // createImgUrl (source, targetDOM) {
    //   // Cloudinary initialize
    //   let timestamp = Math.floor(Date.now() / 1000)
    //   let api_secret = 'yynjtJYNqqHy2XWvBh7x4taVNjI'
    //   let str = `timestamp=${timestamp}${api_secret}` // 規定最後須加上 api_secret
    //   // 將 base64:image 上傳到 cloudinary 轉換成真正的圖片
    //   return fetch('https://api.cloudinary.com/v1_1/ctcimage/image/upload', {
    //     method: 'POST',
    //     headers: new Headers({
    //       'Content-Type': 'application/json'
    //     }),
    //     body: JSON.stringify({
    //       timestamp: timestamp, // 時間戳記 required
    //       file: source, // 欲轉換的 base64 編碼
    //       api_key: '653999464428459',
    //       signature: SHA1(str) // 轉換後的 SHA1 字串
    //     })
    //   })
    //   .then(res => res.json())
    //   .catch(err => console.log(err))
    //   .then(jsondata => {
    //     console.log('image uploaded')
    //     addPicsToTargetArea(jsondata.url, targetDOM)
    //   })
    // }
    getPlansFromDB () {
      markersDB
    }
  }
}
</script>

<style lang="sass" scoped>
.plans__photos
  width: 100%
  // margin: auto
  display: flex
  flex-wrap: wrap
  &__item
    width: 31%
    height: auto
    margin: 3px
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
        // 相機 svg 圖案
        &::after
          width: 3rem
          height: 3rem
          @extend .absolute--center
          background-image: url(../assets/camera.svg)
          background-size: cover
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