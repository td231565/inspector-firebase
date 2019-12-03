<template>
  <div class="printItem" style="width: 100%">
    <u class="printItem__title">{{ mission.name }}</u><br />
    <div class="printItem__block">
      <PrintItemblock class="printItem__block__image" :imgAndText="mission.image" />
      <PrintItemblock class="printItem__block__image"
        v-for="(plan, index) in mission.plans" :key="index+1" :imgAndText="plan" />
      <PrintItemblock class="printItem__block__image"
        v-for="(photo, index) in mission.photos" :key="index+10" :imgAndText="photo" />
    </div>
  </div>
</template>

<script>
import PrintItemblock from './PrintItemBlock'
export default {
  name: 'PrintItem',
  components: {
    PrintItemblock
  },
  props: {
    mission: Object
  },
  computed: {
    
  }
}
</script>

<style lang="sass" scoped>
.printItem
  &__block
    display: flex
    justify-content: space-between
    &__image
      width: 33%
      // height: auto
      // flex: 1

</style>