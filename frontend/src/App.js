import React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import TodoPage from './components/TodoPage';

export default function App() {
  return (
    <CssVarsProvider >
      <CssBaseline />
      <TodoPage />
    </CssVarsProvider>
  );
}