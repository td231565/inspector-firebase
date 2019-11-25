<template>
  <section class="home__bottom__section home__bottom__section__plans">
    <h3>步驟2：請選擇或拍攝-施工圖</h3>
    <!-- <button class="plans__annotation">註記</button> -->

    <PictureList :pictures="plans" @saveAllPhotoTextList="savePlanListToVuex" />
  </section>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import PictureList from './PictureList'

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
      if (!this.selectedMarkerData) return
      return this.selectedMarkerData.plans
    }
  },
  methods: {
    ...mapMutations({
      updatePlans: 'setPlans'
    }),
    savePlanListToVuex (data) {
      this.updatePlans(data)
    },
    addAnnotation () {

    }
  }
}
</script>

<style lang="sass" scoped>

</style>