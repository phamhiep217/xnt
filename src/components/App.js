import React, { Fragment } from "react";
import PropTypes from 'prop-types';
import ContestList from "./ContestList";
import Header from "./Header";
import Contest from "./Contest";
import * as api from "./api";

const pushState = (obj, url) => window.history.pushState(obj, "", url);
const onPopState = handler => {
  window.onpopstate = handler;
};
class App extends React.Component {
  static propTypes= {
    initData: PropTypes.object.isRequired
  };
  state =  this.props.initData;

  componentDidMount() {
    onPopState((event) => {
      this.setState({
        currentContestID:(event.state || {}).currentContestID
      });
    });
  }

  componentWillUnmount() {}

  fetchContest = contestID => {
    pushState({ currentContestID: contestID }, `/contest/${contestID}`);
    api.fetchContest(contestID).then(contest => {
      this.setState({
        currentContestID: contest._id,
        contests: {
          ...this.state.contests,
          [contest._id]: contest
        }
      });
    });
  };
  fetchContestList = () => {
    pushState({ currentContestID: null }, '/');
    api.fetchContestList().then(contests => {
      this.setState({
        currentContestID: null,
        contests
      });
    });
  };
  fetchNames = (nameIds) =>{
    if(nameIds.length === 0 ){
      return;
    }
    api.fetchNames(nameIds).then(names =>{
      this.setState({
        names
      });
    });
  };
  addName = (newName,contestId) => {
    api.addName(newName,contestId).then(resp =>
      this.setState({
        contests:{
          ...this.state.contests,
          [resp.updateContest._id]: resp.updateContest
        },
        names:{
          ...this.state.names,
          [resp.newName._id]:resp.newName
        }
      })  
    ).catch(console.error);
  };
  currentContest() {
    return this.state.contests[this.state.currentContestID];
  }
  pageHeader() {
    if(this.state.currentContestID) {
      return this.currentContest().contestName;
    }
    return 'Name page';
  }
  lookupName = (nameId) => {
    if(!this.state.names || !this.state.names[nameId]){
      return {name: '...'};
    }
    return this.state.names[nameId];
  };
  currentContent() {
    if (this.state.currentContestID) {
      return <Contest
      fetchNames={this.fetchNames}
      contestListClick={this.fetchContestList}
      lookupName={this.lookupName}
      addName={this.addName}
      {...this.currentContest()} />;
    }
    return (
      <ContestList
        onContestClick={this.fetchContest}
        contests={this.state.contests}
      />
    );
  }
  render() {
    return (
      <Fragment>
        <div className="App">
          <Header message={this.pageHeader()} />
          <h2 className="text-center">This is App</h2>
          {this.currentContent()}
        </div>
      </Fragment>
    );
  }
}

export default App;
