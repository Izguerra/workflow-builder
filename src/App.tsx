/** @jsxImportSource @emotion/react */
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { css } from '@emotion/react';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div css={css`
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        `}>
          <Routes>
            <Route path="/" element={<div>Welcome to Workflow Builder</div>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
