<template>
  <section class="home__bottom__section missions">
    <!-- <div class="mission__info">
      <span>請調整畫面至查驗位置或構件，再建立 BIM 視點，並依操作步驟執行。</span>
      <button type="button" class="btn btn__square btn__step" onclick="">建立BIM視點</button>
    </div> -->

    <h3 class="missions__header">
      <span>步驟1：請選擇下列視點、或 BIM 模型上標記</span>
      <img class="missions__header__icon" src="../assets/camera_marker.png" alt="模型標記">
    </h3>

    <MissionsList :missionList="missionList" @toNextStep="toNextStep" />
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { db } from '../config/db'
import MissionsList from './MissionsList.vue'

export default {
  name: 'missions',
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
            // vm.missionList.push(docData)
            vm.missionList.push(doc)
          })
        })
    },
    toNextStep (num) {
      this.$emit('toNextStep', num)
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