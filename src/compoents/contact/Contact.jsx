import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function Contact() {
    const Navigate=useNavigate()
    const [feedback, setFeedback] = useState("");
    const email = localStorage.getItem('email'); 

    const handleSubmit = (e) => {
        e.preventDefault();
        const { value } = e.target;
        setFeedback(value);
    }

    const handlechange = async () => {
        try {
            const response = await axios.post("https://new-backend-s80n.onrender.com/api/users/contact", { email, feedback }, { withCredentials: true });
            if (response.status === 200) {
                toast.success("Form submitted successfully!");
                Navigate('/')
            } else {
                throw new Error("Failed to submit form");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong!");
        }
    }

    return (
        <>
            <div className="contact-container">
                <div className="fr-con">
                    <form onSubmit={handleSubmit}>
                        <h1>Please send me your problem</h1><hr />
                        <label>Email: {email}</label>
                        <label>Feedback:
                            <textarea type="text" name="feedback" placeholder="Feedback" onChange={handleSubmit} required='true'></textarea>
                        </label>
                        <button type="submit" onClick={handlechange}>Submit</button>
                    </form>
                </div>
                <ToastContainer position="top-center" reverseOrder={false} />
            </div>
        </>
    )
}

export default Contact;
