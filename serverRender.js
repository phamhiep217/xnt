import React from 'react';
import ReactDOMServer from 'react-dom/server';

import App from './src/components/App';

import axios from 'axios';
import config from './config';

const getApiUrl = contestID =>{
    if(contestID){
        return `${config.serverUrl}/api/contests/${contestID}`;
    }
    return `${config.serverUrl}/api/contests`;
};
const getInitData = (contestID, apiData) =>{
    if(contestID){
        return {
            currentContestID: apiData._id,
            contests:{
                [apiData._id]: apiData
            }
        }
    }
    return {
        contests: apiData.contests
    };
};

const serverRender = (contestID) => 
axios.get(getApiUrl(contestID))
    .then(resp => {
        const initData = getInitData(contestID, resp.data);
        return {
            initMarkup: ReactDOMServer.renderToString(
                <App initData={initData} />
            ),
            initData
        }
        
    });

export default serverRender;