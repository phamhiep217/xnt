import React from 'react';
import ReactDOM from 'react-dom';

import data from './data';
import App from './components/App';

ReactDOM.hydrate(
   <App initContests={data.contests}/>,
    document.getElementById('root')
  );