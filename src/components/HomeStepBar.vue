<template>
  <div class="step">
    <section class="step__column flex--left">
      <a class="btn btn__square step__column__controls" data-text="建立查驗點" @click="gotoAddNewMarker" v-if="userAuth && stepNow === 1">建立查驗點</a>
      <a class="btn btn__square step__column__controls" data-text="管理介面" @click="gotoManagement" v-if="isAdmin && stepNow === 1">管理介面</a>
      <div class="flex--left" v-if="stepNow !== 1">
        <a class="btn btn__square step__column__controls" data-text="上一步" @click="stepPrev">上一步</a>
        <a class="btn btn__square step__column__controls" data-text="下一步" @click="stepNext"  v-if="stepNow !== 4">下一步</a>
      </div>
    </section>

    <section class="step__column flex--right">
      <a class="btn btn__square step__column__controls" data-text="列印報表" @click="gotoPrint" v-if="stepNow === 1">列印報表</a>
      <a class="btn btn__square step__column__controls" data-text="回列表" @click="stepToFirst" v-else>回列表</a>
    </section>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'StepBar',
  props: {
    stepNow: Number
  },
  data () {
    return {
      isAdmin: false
    }
  },
  computed: {
    ...mapState({
      userAuth: state => state.userState.userAuth,
      userInfo: state => state.userState.userInfo
    })
  },
  methods: {
    stepPrev () {
      this.$emit('stepPrev')
    },
    stepNext () {
      this.$emit('stepNext')
    },
    stepToFirst () {
      this.$emit('stepToFirst')
    },
    ...mapMutations({
      addingNewMarker: 'addingNewMarker'
    }),
    gotoAddNewMarker () {
      // this.$emit('gotoAddNewMarker')
      this.addingNewMarker(true)
    },
    gotoPrint () {
      this.$emit('gotoPrint')
    },
    gotoManagement () {
      this.$emit('gotoManagement')
    },
    isAdminGroup () {
      let userInfo = this.userInfo
      if (!userInfo) return
      this.isAdmin = (userInfo.group === 'admin') ? true : false
    },
  },
  watch: {
    userInfo () {
      this.isAdminGroup()
    }
  },
  created () {
    this.isAdminGroup()
  }
}
</script>

<style lang="scss" scoped>
.step {
  width: 100%;
  height: 50px;
  display: flex;
  background-color: $bg_stepBar;

  @include ae768 {
    font-size: 0.8rem;
  }

  &__column {
    flex: 1;
    padding: 10px;
    display: flex;
    align-items: center;
    &__controls {
      padding: 0 0.8rem;
      position: relative;
      font-weight: 600;
      // color: #fff;
      color: transparent;
      background-color: transparent;
      border-color: #fff;
      box-sizing: content-box;
      &::before {
        width: 6px;
        height: 100%;
        display: block;
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(#000, 0.2);
        transition: width ease 0.3s;
      }
      &::after {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-30%);
        display: block;
        content: attr(data-text);
        color: #fff;
      }
      &:hover {
        &::before {
          width: 100%;
        }
      }
      &:active {
        &::after {
          color: rgba(#000, 0.6);
        }
      }
    }
  }
}
</style>