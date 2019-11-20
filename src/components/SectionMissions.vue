<template>
  <section class="home__bottom__section home__bottom__section__missions">
    <h3 class="missions__header">
      <span>步驟1：請選擇下列視點、或 BIM 模型上標記</span>
      <img class="missions__header__icon" src="../assets/camera_marker.png" alt="模型標記">
    </h3>

    <MissionsList :missionList="missionList" @stepNext="stepNext" />
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { db } from '../config/db'
import MissionsList from './MissionsList.vue'

export default {
  name: 'SectionMissions',
  components: {
    MissionsList
  },
  data () {
    return {
      missionList: []
    }
  },
  computed: {
    ...mapState({
      modelName: state => state.modelState.modelName,
      modelPath: state => state.modelState.modelPath
    }),
  },
  methods: {
    getModelMissionsFromDB () {
      let vm = this
      vm.missionList = []
      db.collection('markersData').doc('gugci_d')
        .collection(vm.modelName).get().then(docs => {
          docs.forEach(doc => {
            let docData = doc.data()
            if (!docData.name) return
            vm.missionList.push(doc)
          })
        })
    },
    stepNext () {
      this.$emit('stepNext')
    }
  },
  watch: {
    modelName () {
      this.getModelMissionsFromDB()
    }
  },
  created () {
    this.getModelMissionsFromDB()
  }
}
</script>

<style lang="sass" scoped>
.missions__header
  &__icon
    width: 1.5rem
    height: 1.5rem
    transform: translate(3px,5px)
</style>