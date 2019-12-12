<template>
  <section class="home__bottom__section home__bottom__section__plans">
    <h3>步驟2：請選擇或拍攝-施工圖</h3>

    <PictureList :pictures="plans"
      @uploadLocalPicture="uploadLocalPicture"
      @deletePicture="deletePicture"
      @updatePicture="updatePictureToPlan" />
  </section>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import PictureList from '../components/PictureList'

export default {
  name: 'SectionPlans',
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
    plans () {
      return this.selectedMarkerData.plans
    }
  },
  methods: {
    ...mapMutations({
      addPlan: 'addPlanToSelectedMarker',
      deletePlan: 'deletePlanFromSelectedMarker',
      updatePlan: 'updatePlanToSelectedMarker'
    }),
    uploadLocalPicture (data) {
      this.addPlan(data)
    },
    deletePicture (index) {
      this.deletePlan(index)
    },
    updatePictureToPlan (data) {
      this.updatePlan(data)
    }
  }
}
</script>

<style lang="sass" scoped>

</style>