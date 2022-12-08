import React, { useRef, useState } from 'react'
import { Card, Button, Alert, Form } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
//import { firestore } from '../firebase'
//import { useCollectionData } from "react-firebase-hooks/firestore"
//import { collection } from "@firebase/firestore"
import { createUserTask } from '../firebase.js'

export default function Dashboard() {
    
    const taskTypeRef = useRef()
    const taskNameRef = useRef()
    const taskDescRef = useRef()

    //this.state = {value: ''}
    

    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const { currentUser, logout } = useAuth()
    const navigation = useNavigate()






    async function handleLogout() {
        setError("")

        try {
            await logout()
            navigation("/login")
        } catch {
            setError("Failed to log out")
        }
    }

    async function handleAddTask(e) {
        e.preventDefault()

        try {
            setError("")
            setLoading(true)
            await createUserTask(currentUser, taskTypeRef.current.value, taskNameRef.current.value, taskDescRef.current.value)
            navigation("/")
        } catch {
            setError("Failed to Add Task")
        }
        
        setLoading(false)
        e.target.reset()
    }






    return (
        <>
            <div>
                Hello
            </div>
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
                        
                        <Button disabled={loading} className="w-100" type="submit">
                            Create Task
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <br></br>
            <Card>
                <Card.Body>
                    <h2 className="text-center mb-4">Profile</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <strong>Email: </strong> {currentUser.email}
                </Card.Body>
            </Card>
            <div className="w-100 text-center mt-2">
                <Button variant="link" onClick={handleLogout}>Log Out</Button>
            </div>
        </>
    )
}
/*
                <Form onSubmit={handleAddTask}>
                    <Form.Group id="TaskType">
                        <Form.Label>Task Type</Form.Label>
                        <Form.Control required />
                    </Form.Group>
                        <Form.Group id="TaskName">
                        <Form.Label>Task Name</Form.Label>
                        <Form.Control required />
                    </Form.Group>
                    <Button className="w-100" type="submit">
                        Create Task
                    </Button>
                </Form>
                    */