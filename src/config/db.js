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
const markersDB = db.collection('markersData').doc('gugci_d')
const fireAuth = firebase.auth()
// const storageRef = firebase.storage()

function updateUserAuthDisplayName (userAuth, profile) {
  userAuth.updateProfile({
    displayName: profile.name,
    phoneNumber: profile.phone
  }).then(() => {
    console.log('User Auth update success')
  }).catch(err => {
    console.log(err.code)
  })
}

function addNewUserToDB (uid, profile) {
  let timeValue = format(new Date(), 'T')

  db.collection('userGroup').doc(uid).set({
    signup: timeValue,
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm:ss'),
    email: profile.email,
    name: profile.name,
    phone: profile.phone,
    group: 'user',
    uid
  }).then(() => {
    console.log('Sign up success')
  }).catch(err => {
    console.log(err.code)
  })
}

const fireAuthSignUp = profile => {
  return fireAuth.createUserWithEmailAndPassword(profile.email, profile.pwd).then(user => {
    let uid = user.user.uid
    addNewUserToDB(uid, profile)
    updateUserAuthDisplayName(user.user, profile)

    return uid
  })
}

const fireAuthSignIn = (email, pwd) => {
  return fireAuth.signInWithEmailAndPassword(email, pwd).then(() => {
    console.log('user login success')
  })
}

export { db, markersDB, fireAuth, fireAuthSignUp, fireAuthSignIn }