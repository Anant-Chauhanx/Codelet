import React, { useEffect, useState } from "react";
import { useSubmissions } from "../context/SubmissionsContext";
import "./Submissions.css";
import { format } from "date-fns";
import Pagination from "./Pagination";
import { FaCopy } from "react-icons/fa";

function Submissions() {
  const { submissions, fetchSubmissions } = useSubmissions();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const indexOfLastSubmission = currentPage * rowsPerPage;
  const indexOfFirstSubmission = indexOfLastSubmission - rowsPerPage;
  const currentSubmissions = submissions.slice(
    indexOfFirstSubmission,
    indexOfLastSubmission
  );

  const totalPages = Math.ceil(submissions.length / rowsPerPage);

  const handleCopy = (submission) => {
    const stdout = submission.stdout
      ? new TextDecoder("utf-8").decode(
          new Uint8Array(
            atob(submission.stdout)
              .split("")
              .map((c) => c.charCodeAt(0))
          )
        )
      : "Error: No output";

    const submissionDetails = `Username: ${submission.username}
Language: ${submission.language}
Stdin: ${submission.stdin}
Source Code:
${submission.source_code}
Stdout:
${stdout}
Submission Time: ${format(
      new Date(submission.submission_time),
      "dd/MM/yyyy HH:mm:ss"
    )}`;

    navigator.clipboard
      .writeText(submissionDetails)
      .then(() => {
        alert("Submission details copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy!", err);
      });
  };

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
              <th>Copy</th> {/* Added missing column header */}
            </tr>
          </thead>
          <tbody>
            {currentSubmissions.map((submission, index) => (
              <tr key={index}>
                <td>{submission.username}</td>
                <td>{submission.language}</td>
                <td>{submission.stdin}</td>
                <td className="source-code">
                  {submission.source_code
                    ? submission.source_code.substring(0, 100)
                    : "N/A"}
                </td>
                <td>
                  {submission.stdout
                    ? new TextDecoder("utf-8").decode(
                        new Uint8Array(
                          atob(submission.stdout)
                            .split("")
                            .map((c) => c.charCodeAt(0))
                        )
                      )
                    : "Error: No output"}
                </td>
                <td>
                  {submission.submission_time
                    ? format(
                        new Date(submission.submission_time),
                        "dd/MM/yyyy HH:mm:ss"
                      )
                    : "N/A"}
                </td>
                <td>
                  <FaCopy
                    className="copy-icon"
                    onClick={() => handleCopy(submission)}
                  />
                </td>
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
