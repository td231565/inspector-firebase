import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
// import "firebase/storage"
import { format } from 'date-fns'

firebase.initializeApp({
  apiKey: "AIzaSyBhiRNvb_UrK-IQCaXBO0WT7dQ-lXU6lQk",
  authDomain: "sme-markers-data-demo.firebaseapp.com",
  databaseURL: "https://sme-markers-data-demo.firebaseio.com",
  projectId: "sme-markers-data-demo",
  storageBucket: "sme-markers-data-demo.appspot.com",
})

const db = firebase.firestore()
const fireAuth = firebase.auth()
// const storageRef = firebase.storage()
// const { TimeStamp, GeoPoint } = firebase.firestore

const fireAuthSignUp = (email, pwd) => {
  fireAuth.createUserWithEmailAndPassword(email, pwd).then(user => {
    let uid = user.user.uid
    let date = format(new Date(), 'yyyy-MM-dd')
    let time = format(new Date(), 'HH:mm:ss')
    let timeValue = format(new Date(), 'T')

    db.collection('userGroup').doc(uid).set({
      signup: timeValue,
      date,
      time,
      email,
      uid
    }).then(() => {
      console.log('sign up')
    }).catch(err => {
      console.log(err.code)
    })
  })
}

export { db, fireAuth, fireAuthSignUp }