<template>
  <ul class="form__item missionList">
    <li class="form__item missionList__item"
      v-for="(mission, index) in missionList"
      :key="index+1"
      @click="selectMission(mission)">
      <div class="missionList__item__pic">
        <img class="absolute--center" :src="mission.image" :alt="mission.name">
      </div>
      <div class="missionList__item__text">
        <p class="missionList__item__text__date">{{ mission.date }}</p>
        <p class="missionList__item__text__name">{{ mission.floor }}_{{ mission.issue }}_{{ mission.name }}</p>
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

<style lang="scss" scoped>
.missionList {
  width: 78%;
  height: 100%;
  margin: auto;
  margin-bottom: 0;
  display: flex;
  flex-wrap: wrap;

  @include ae1100 {
    width: 88%;
  }
  @include ae768 {
    width: 76%;
  }
  @include ae480 {
    width: 90%;
  }

  &__item {
    width: 31%;
    margin: 1%;
    border: 1px solid $bd_input_default;
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    opacity: 0.7;
    &:hover {
      opacity: 1;
    }

    @include ae1100 {
      opacity: 1;
    }
    @include ae480 {
      width: 47.5%;
    }

    &__pic {
      width: 100%;
      padding-top: 75%;
      position: relative;
      overflow: hidden;

      @include ae768 {
        height: 100px;
      }

      img {
        max-width: 100%;
        display: block; // 消除 img 底部與 div 間的空白
      }
    }
    &__text {
      margin: 10px;
      position: relative;
      > p {
        margin: 3px 0;
      }
      &__name {
        color: $text_strong;
        font-weight: 900;
      }
      &__date {
        color: $text_hint;
      }
    }
  }
}
</style>