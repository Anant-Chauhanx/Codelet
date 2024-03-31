import React, { useEffect, useState } from 'react';
import { useSubmissions } from '../context/SubmissionsContext';
import './Submissions.css';
import { format } from 'date-fns';
import Pagination from './Pagination';

function Submissions() {
  const { submissions, fetchSubmissions } = useSubmissions();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const indexOfLastSubmission = currentPage * rowsPerPage;
  const indexOfFirstSubmission = indexOfLastSubmission - rowsPerPage;
  const currentSubmissions = submissions.slice(indexOfFirstSubmission, indexOfLastSubmission);

  const totalPages = Math.ceil(submissions.length / rowsPerPage);

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
              <th>Stdout</th>
              <th>Time Stamp</th>
            </tr>
          </thead>
          <tbody>
            {currentSubmissions.map((submission) => (
              <tr key={submission.id}>
                <td>{submission.username}</td>
                <td>{submission.language}</td>
                <td>{submission.stdin}</td>
                <td className="source-code">{submission.source_code.substring(0, 100)}</td>
                <td>{submission.stdout}</td>
                <td>{submission.submission_time ? format(new Date(submission.submission_time), 'dd/MM/yyyy HH:mm:ss') : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(value) => setRowsPerPage(parseInt(value))}
        />
      </div>
    </div>
  );
}

export default Submissions;
