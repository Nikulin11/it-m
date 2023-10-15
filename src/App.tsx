import React, { useEffect, useState } from 'react';
import './App.css';
import { Charts } from './shared/Charts';
import { Layout } from './shared/Layout';

function App() {
  return (
    <div className="App">
      <Layout>
        <Charts />
      </Layout>
    </div>
  );
}

export default App;
