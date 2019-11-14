<template>
  <section class="home__bottom__section plans">
    <h3>步驟2：請選擇或拍攝-施工圖</h3>
    
    <ul class="plans__photos photos">
      <li class="photos__item">
        <label for="planUpload" class="photos__item__block photos__item__block--camera">
          <input type="file" id="planUpload" accept="image/*" multiple @change="handelFileUploadFromLocal">
        </label>
      </li>
      <!-- insert new itemBox -->
      <PhotoItem v-for="(plan, index) in plans"
        :key="'p' + index+1"
        :photo="plan" />
      <PhotoItem v-for="(img, index) in imgUploadList"
        :key="'u' + index+1"
        :photo="img" />
    </ul>
  </section>
</template>

<script>
// import { markersDB } from '../config/db'
import { mapState } from 'vuex'
import PhotoItem from './PhotoItem'
// import SHA1 from '../config/sha'

export default {
  name: 'SectionPlans',
  components: {
    PhotoItem
  },
  data () {
    return {
      uploadImg: '',
      imgUploadList: []
    }
  },
  computed: {
    ...mapState({
      modelName: state => state.modelState.modelName,
      selectedMarker: state => state.modelState.selectedMarker,
      selectedMarkerData: state => state.modelState.selectedMarkerData
    }),
    plans () {
      if (!this.selectedMarkerData) return
      return this.selectedMarkerData.plans
    }
  },
  methods: {
    // 處理本機上傳圖片
    handelFileUploadFromLocal (e) {
      // console.log(e)
      let file = e.target.files[0]
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = ev => {
        let uploadImg = ev.target.result
        this.imgUploadList.push(uploadImg)
      }
    }
  }
}
</script>

<style lang="sass" scoped>

</style>