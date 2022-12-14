//test

import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import 'firebase/compat/firestore'


// const nodemailer = require('nodemailer');


const app = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
})

export const auth = app.auth()
export const firestore = firebase.firestore()

export const getEmails = async () => {
    const userRef = firestore.collection('users');
    const users = await userRef.get();
    users.forEach(doc =>{
        var email = doc.get('email');
        console.log(doc.id, '=>', email);
        getTaskInfo(doc.id)
    })
}

export const getTaskInfo = async (userId) =>{
    const taskRef = firestore.collection(`users/${userId}/tasks/`)
    const tasks = await taskRef.get()
    tasks.forEach(task =>{
        var name = task.get('taskName')
        var desc = task.get('taskDesc')
        var time = task.get('taskTime')
        console.log(name, "=>", desc, "=>", time)
    })
}
//For adding a user to the firestore after an account is created
export const createUserDocument = async (user) => {
    if (!user) return;
    
    const userRef = firestore.doc(`users/${user.uid}`)
    console.log(user)
    const snapshot = await userRef.get()

    if (!snapshot.exists) {
        const {email} = user
        //const {displayName} = "Test Name"

        try {
            userRef.set({
                //displayName,
                email,
                createdAt: new Date()
            })
        } catch(error) {
            console.log('Error in creating user', error)
        }
    }
}

//For adding a task when a user wants to add a task
//CONTROLLER 
export const createUserTask = async (user, tType, tName, tDesc, tTime) => {
    if (!user) return;
    console.log(user, tType)
    //SOME RANDOMLY GENERATED ID
    const id = Math.random() * 10
    while (true){
        const taskRef = firestore.doc(`users/${user.uid}/tasks/${id}`)
        const taskSnapshot = await taskRef.get()
        if (!taskSnapshot.exists) {
            
            //REPLACE CONSTANTS WITH VARIABLES BROUGHT IN FROM DASHBOARD POST
            const taskID = id
            const taskType = tType
            const taskName = tName
            const taskDesc = tDesc
            const taskTime = tTime 

            //UPDATE THE MODEL/DATABASE
            try {

                taskRef.set({
                    taskID,
                    taskType,
                    taskName,
                    taskDesc,
                    taskTime,
                })
                
            } catch(error) {
                console.log('Error in creating task', error)
            }
            break
        }
        else{
            const id = Math.random() * 10
        }
    }
}

export const updateUserDocument = async (user, newEmail) => {
    if (!user) return;
    
    const userRef = firestore.doc(`users/${user.uid}`)
    const email = newEmail
    console.log(user)
    const snapshot = await userRef.get()

    if (snapshot.exists) {
        try {
            userRef.set({
                email,
                createdAt: new Date()
            })
        } catch(error) {
            console.log('Error in creating user', error)
        }
    }
}

export default app