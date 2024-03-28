import React, { useEffect } from 'react';
import { useSubmissions } from '../context/SubmissionsContext';
import './Submissions.css';
import { format } from 'date-fns';

function Submissions() {
  const { submissions, fetchSubmissions } = useSubmissions();

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  return (
    <div className="grid-background">
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Language</th>
              <th>Stdin</th>
              <th>Source Code</th>
              <th>Submission Time</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id}>
                <td>{submission.username}</td>
                <td>{submission.language}</td>
                <td>{submission.stdin}</td>
                <td className="source-code">{submission.source_code.substring(0, 100)}</td>
                <td>{submission.submission_time ? format(new Date(submission.submission_time), 'dd/MM/yyyy HH:mm:ss') : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Submissions;
