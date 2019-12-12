<template>
  <ul class="form__item missionList">
    <li class="form__item missionList__item"
      v-for="(mission, index) in missionList"
      :key="index+1"
      @click="selectMission(mission)">
      <div class="missionList__item__pic">
        <img :src="mission.image" :alt="mission.name">
      </div>
      <div class="missionList__item__textArea">
        <p class="missionList__item__textArea__date">{{ mission.date }}</p>
        <p class="missionList__item__textArea__name">{{ mission.floor }}_{{ mission.issue }}_{{ mission.name }}</p>
      </div>
    </li>
  </ul>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'MissionList',
  props: {
    missionList: Array
  },
  data () {
    return {

    }
  },
  computed: {

  },
  methods: {
    ...mapMutations({
      setSelectedMarkerData: 'setSelectedMarkerData'
    }),
    selectMission (mission) {
      this.setSelectedMarkerData(mission)
      this.$emit('stepNext')
    }
  }
}
</script>

<style lang="sass" scoped>
.missionList
  width: 78%
  height: 100%
  margin: auto
  margin-bottom: 0
  display: flex
  justify-content: flex-start
  flex-wrap: wrap

  @include ae1100
    width: 88%
  @include ae768
    width: 76%
  @include ae480
    width: 100%

  &__item
    width: 32%
    max-width: 265px
    margin: 0.66%
    border: 1px solid $bd_input_default
    border-radius: 10px
    overflow: hidden
    cursor: pointer
    opacity: 0.7
    &:hover
      opacity: 1

    @include ae1100
      opacity: 1
    @include ae768
      max-width: 174px

    &__pic
      width: 100%
      height: 160px
      display: flex
      justify-content: center
      overflow: hidden

      @include ae768
        height: 100px

      img
        max-width: 100%
        display: block // 消除 img 底部與 div 間的空白
    &__textArea
      margin: 10px
      position: relative
      > p
        margin: 3px 0
      &__floor
        position: absolute
        top: 0
        right: 0
        font-size: 13px
        color: #808080
      &__name
        color: #005dba
        font-weight: 900
      &__date
        color: #505050
</style>