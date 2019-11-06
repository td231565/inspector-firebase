/* Firebase init */
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
// import "firebase/storage"

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

export { db, fireAuth }