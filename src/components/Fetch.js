import React, {useState} from 'react'
import firebase, { firestore } from "../firebase"
import { useAuth } from '../contexts/AuthContext'
import { Card, Button, Alert, Form } from 'react-bootstrap'

export default function Fetch() {


    const [allDocs, setAllDocs] = useState([])
    const { currentUser } = useAuth()

    //const [singleDoc, setSingleDoc]=useState({})

    function fetchAll(e){
        e.preventDefault()

        setAllDocs([])


        firestore.collection(`users/${currentUser.uid}/tasks`)
        .get()
        .then((snapshot)=> {
            if(snapshot.docs.length>0){
                snapshot.docs.forEach((doc)=> {
                    setAllDocs((prev) =>{
                        return[...prev,doc.data()]
                    })
                })
            }
        })
        console.log(allDocs)
    }

    return (
        <div>
            <h1>Fetching Data</h1>
            <br></br>
            <div>
                {allDocs.map((doc)=>{
                    return(
                        <Card>
                        <br></br>
                        <div>
                            <h1>{doc.taskType}</h1>
                            <h1>{doc.taskName}</h1>
                            <h1>{doc.taskDesc}</h1>
                        </div>
                        <br></br>
                        </Card>
                    )
                })}
            </div>

            <button onClick={fetchAll}>Fetch All Tasks</button>
        </div>
        
    )
}
