import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useSubmissions } from '../context/SubmissionsContext';
import './Form.css';

function Form({ isButtonClicked }) {
  const [formData, setFormData] = useState({
    username: '',
    language: 'Python',
    stdin: '',
    source_code: '',
  });

  const usernameRef = useRef(null);

  useEffect(() => {
    if (isButtonClicked !== null && usernameRef.current) {
      usernameRef.current.focus();
    }
  }, [isButtonClicked]);

  const { addSubmission } = useSubmissions();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      submission_time: new Date().toISOString(),
    };
    try {
      console.log('API URL:', process.env.REACT_APP_API_URL);
      const response = await axios.post(process.env.REACT_APP_API_URL, submissionData);
      console.log(response.data);
      alert('Submission successful!');
      addSubmission(response.data.submissionId);
      setFormData({
        username: '',
        language: 'Python',
        stdin: '',
        source_code: '',
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert('Submission failed.');
    }
  };

  return (
    <div className="grid-background">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input ref={usernameRef} type="text" name="username" value={formData.username} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Preferred Language</label>
            <select name="language" value={formData.language} onChange={handleChange} required>
              <option value="Python">Python</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Java">Java</option>
              <option value="C++">C++</option>
            </select>
          </div>
          <div className="form-group">
            <label>Stdin</label>
            <input type="text" name="stdin" value={formData.stdin} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Source Code</label>
            <textarea name="source_code" value={formData.source_code} onChange={handleChange} required />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default Form;
