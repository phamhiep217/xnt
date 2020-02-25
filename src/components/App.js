import React, { Fragment } from "react";
import Header from "./Header";
import axios from "axios";
import ContestPreview from "./ContestPreview";
class App extends React.Component {
  state = {
    pageHeader: "Naming Contests",
    contests: this.props.initContests
  };
  componentDidMount() {
    axios
      .get("/api/contests")
      .then(resp => {
        this.setState({
          contests: resp.data.contests
        });
      })
      .catch(console.error);
  }
  componentWillUnmount() {}
  render() {
    return (
      <Fragment>
        <div className="App">
          <Header message={this.state.pageHeader} />
          <h2 className="text-center">This is App</h2>
          <div>
            {this.state.contests.map(item => (
              <ContestPreview key={item.id} {...item} />
            ))}
          </div>
        </div>
      </Fragment>
    );
  }
}
export default App;
