import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const SubmissionsContext = createContext();

export const useSubmissions = () => useContext(SubmissionsContext);

export const SubmissionsProvider = ({ children }) => {
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        try {
            const { data } = await axios.get('http://localhost:3001/api/submissions');
            setSubmissions(data);
        } catch (error) {
            console.error("Error fetching submissions:", error);
        }
    };

    const addSubmission = (submission) => {
        setSubmissions((prevSubmissions) => [submission, ...prevSubmissions]);
    };

    return (
        <SubmissionsContext.Provider value={{ submissions, fetchSubmissions, addSubmission }}>
            {children}
        </SubmissionsContext.Provider>
    );
};
