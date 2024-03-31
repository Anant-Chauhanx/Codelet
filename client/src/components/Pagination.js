import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange, rowsPerPage, onRowsPerPageChange }) => {
    return (
        <div className="pagination">
            <span>Rows per page</span>
            <div className="pagination-controls">
                <select value={rowsPerPage} onChange={(e) => onRowsPerPageChange(e.target.value)}>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>

                <button onClick={() => onPageChange(1)} disabled={currentPage === 1}>
                    <i className="fas fa-angle-double-left"></i>
                </button>
                <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                    <i className="fas fa-angle-left"></i>
                </button>
                <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    <i className="fas fa-angle-right"></i>
                </button>
                <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
                    <i className="fas fa-angle-double-right"></i>
                </button>
            </div>

            <span>
                Page {currentPage} of {totalPages}
            </span>
        </div>
    );
};

export default Pagination;