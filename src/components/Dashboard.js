import React, { useRef, useState, useEffect } from 'react'
import { Card, Button, Alert, Form } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
//import { firestore } from '../firebase'
//import { useCollectionData } from "react-firebase-hooks/firestore"
//import { collection } from "@firebase/firestore"
import { createUserTask } from '../firebase.js'
import firebase, { firestore } from "../firebase"

export default function Dashboard() {
    
    const taskTypeRef = useRef()
    const taskNameRef = useRef()
    const taskDescRef = useRef()
    const taskTimeRef = useRef()
    const dataFetchedRef = useRef(false);

    const fetchRef = useRef()

    const [allDocs, setAllDocs] = useState([])  

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const { currentUser, logout } = useAuth()
    const navigation = useNavigate()


    //Loads the task list ONCE
    useEffect(() => {
        console.log('useEffect ran');
        if (dataFetchedRef.current) return
        dataFetchedRef.current = true
        fetchAll()
    }, [])

    async function handleLogout() {
        setError("")

        try {
            await logout()
            navigation("/login")
        } catch {
            setError("Failed to log out")
        }
    }

    //Adds a task to the database
    async function handleAddTask(e) {
        e.preventDefault()

        try {
            setError("")
            setLoading(true)
            await createUserTask(currentUser, taskTypeRef.current.value, taskNameRef.current.value, taskDescRef.current.value, taskTimeRef.current.value)
            navigation("/")
            //Should update task list by calling fetchAll again
            fetchAll()
        } catch {
            setError("Failed to Add Task")
        }
        
        setLoading(false)
        e.target.reset()
    }

    //Function to get all tasks from user's database 
    function fetchAll(){
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

    function deleteTask(taskUID){
        console.log(taskUID)
        firestore.collection(`users/${currentUser.uid}/tasks`).doc(`${taskUID}`).delete()
        fetchAll()
    }



    //HTML CODE TO BE CHANGED WITH CSS/BOOTSTRAP
    return (
            <html>
            <head>
            <title>Group 6 CPS final</title>
            </head>
            <body>
            {/* profile */}
            <Card>
                <Card.Body>
                    <h2 >Profile</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <strong>Email: </strong> {currentUser.email}
                </Card.Body>
            </Card>
            <div>
                <Button variant="link" onClick={handleLogout}>Log Out</Button>
            </div>
            {/* add task form */}
            <Card>
                <Card.Body>

                    <Form onSubmit={handleAddTask}>
                        <Form.Select id="TaskType" ref={taskTypeRef}>
                            <option value = "Recurring">Recurring Task</option>
                            <option value = "One Time">One Time Task</option>
                            <option value = "Deadline">Deadline Task</option>

                        </Form.Select>
                        <Form.Group id="TaskName">
                            <Form.Label>Task Name</Form.Label>
                            <Form.Control ref={taskNameRef} required />
                        </Form.Group>
                        <Form.Group id="TaskDesc">
                            <Form.Label>Task Description</Form.Label>
                            <Form.Control ref={taskDescRef} required />
                        </Form.Group>
                        <label for="Task Date">Date and Time:</label><br></br>
                        <input type="datetime-local" id="taskDate" ref={taskTimeRef}></input>
                        <br></br>
                        <Button disabled={loading} className="w-100" type="submit">
                            Create Task
                        </Button>
                    </Form>
                    <button>
                            Fetch All Test
                    </button>
                </Card.Body>
            </Card>
            <Card>
            {/* display tasks */}
                
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
                                    <h1>{doc.taskTime}</h1>
                                </div>
                                <br></br>
                                </Card>
                            )
                        })}
                    </div>

                    <button onClick={fetchAll}>Fetch All Tasks</button>
                </div>

            </Card>
            </body>
        </html>
    )
}
