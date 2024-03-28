import React from 'react';
import './Header.css';
import CelebrateIcon from '../assets/CelebrateIcon.png';
import ArrowIcon from '../assets/ArrowIcon.png';
import GithubIcon from '../assets/GithubIcon.png';

const Header = ({ onButtonClick }) => {
  return (
    <div className="modern-background">
      <div className="header-grid-container"></div>
      <div className="centered-content">
        <div className="introducing-blocks">
          <a href="https://github.com/Anant-Chauhanx/CodeLet" target="_blank" rel="noopener noreferrer">
            <img src={CelebrateIcon} alt="Celebrate Icon" className="left-icon" />
            <span>Introducing Codelet</span>
            <img src={ArrowIcon} alt="Arrow Icon" className="right-icon" />
          </a>
        </div>
        <h1><span>Code submit</span>&nbsp;<span>and</span>&nbsp;<span>view</span></h1>
        <p>A web application that facilitates the submission and display of code snippets.</p>
        <div className="button-container">
          <button className="get-started" onClick={() => onButtonClick((prev) => prev + 1)}>Get Started</button>
          <a href="https://github.com/Anant-Chauhanx" target="_blank" rel="noopener noreferrer" className="github">
            <img src={GithubIcon} alt="Github Icon" className="github-icon" />
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;