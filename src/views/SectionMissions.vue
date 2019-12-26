<template>
  <section class="home__bottom__section home__bottom__section__missions">
    <h3 class="missions__header">
      <span>步驟1：請選擇下列視點、或 BIM 模型上標記</span>
      <img class="missions__header__icon" src="../assets/camera_marker.png" alt="模型標記">
    </h3>

    <MissionsList :missionList="markerList" @stepNext="stepNext" />
  </section>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import MissionsList from '../components/MissionsList.vue'
import InternetConnection from '../config/connection'

export default {
  name: 'SectionMissions',
  components: {
    MissionsList
  },
  data () {
    return {
      
    }
  },
  computed: {
    ...mapState({
      markerList: state => state.modelState.markerList,
      modelName: state => state.modelState.modelName,
      modelPath: state => state.modelState.modelPath
    }),
  },
  methods: {
    ...mapActions({
      getMarkerList: 'getMarkerList'
    }),
    stepNext () {
      this.$emit('stepNext')
    },
    ...mapMutations({
      setSelectedMarkerData: 'setSelectedMarkerData'
    }),
    clearMarkerData () {
      this.setSelectedMarkerData(null)
    }
  },
  watch: {
    modelName: {
      handler () {
        let connection = InternetConnection()
        if (connection) this.getMarkerList()
      },
      immediate: true
    }
  },
  created () {
    this.clearMarkerData()
  }
}
</script>

<style lang="scss" scoped>
.missions__header {
  &__icon {
    width: 1.5rem;
    height: 1.5rem;
    transform: translate(3px,5px);
  }
}
</style>