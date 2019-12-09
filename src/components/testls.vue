<template>
  <div class="test">
    <p>Hello! <input v-model="name" />, welcome.</p>
    <p>your mobile is <input v-model="phone" />,</p>
    <p>your birth is <input v-model="birth" />.</p>
    <button @click="save">Save</button>
  </div>
</template>

<script>
export default {
  name: 'test',
  data () {
    return {
      name: '',
      phone: 0,
      birth: ''
    }
  },
  methods: {
    save () {
      let obj = {
        name: this.name,
        phone: this.phone,
        secret: {
          birth: this.birth
        }
      }
      let objParsed = JSON.stringify(obj)
      localStorage.setItem('profile', objParsed)
    },
    get () {
      if (localStorage.getItem('profile')) {
        let objString = localStorage.getItem('profile')
        let obj = JSON.parse(objString)
        this.name = obj.name
        this.phone = obj.phone
        this.birth = obj.secret.birth
      }
    }
  },
  mounted () {
    this.get()
  }
}
</script>