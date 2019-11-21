<template>
  <ul class="form">
    <h4 class="form__title">新查驗點資訊</h4>

    <li class="form__items">
      <label class="form__items__title">查驗點名稱</label>
      <input type="text" class="form__items__cells" v-model="name" />
    </li>
    <li class="form__items">
      <label class="form__items__title">樓層</label>
      <input type="text" class="form__items__cells" v-model="floor" />
    </li>
    <li class="form__items">
      <label class="form__items__title">查驗項目</label>
      <input type="text" class="form__items__cells" v-model="issue" />
    </li>
    <li class="form__items__footer flex--center">
      <button class="btn btn__square" @click="setMarkerInfo">確定</button>
      <button class="btn btn__square" @click="cancelAddNewMarker">取消</button>
    </li>
  </ul>
</template>

<script>
import { format } from 'date-fns'
import { mapState } from 'vuex'

export default {
  name: 'NewMarkerForm',
  data () {
    return {
      name: '',
      floor: '',
      issue: '',
      createDate: format(new Date, 'yyyy-MM-dd')
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userState.userInfo
    }),
    creator () {
      return this.userInfo.name
    }
  },
  methods: {
    setMarkerInfo () {
      let info = {
        name: this.name,
        floor: this.floor,
        issue: this.issue,
        createDate: this.createDate,
        creator: this.creator,
      }
      this.$emit('addMarkerInfo', info)
    },
    cancelAddNewMarker () {
      this.$emit('cancelAddNewMarker')
    }
  }
}
</script>

<style lang="sass" scoped>
.form
  width: 60%
  margin: 2rem auto
  padding: 2rem
  background-color: $bg_default
  &__title
    margin-top: 0

.btn
  &:hover
    border-color: $bd_input_focus
</style>