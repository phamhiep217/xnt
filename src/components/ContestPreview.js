import PropTypes from "prop-types";
import React, { Component } from "react";

class ContestPreview extends Component {

  HandleClick = () => {
    this.props.onClick(this.props._id);
  };

  render() {
    return (
      <div id={this.props.id} className="ContestPreview" onClick={this.HandleClick}>
        <div className="category-name">{this.props.categoryName}</div>
        <div className="contest-name">{this.props.contestName}</div>
      </div>
    );
  }
}

ContestPreview.propTypes = {
  _id: PropTypes.string.isRequired,
  categoryName: PropTypes.string,
  contestName: PropTypes.string,
  onClick: PropTypes.func.isRequired
};

export default ContestPreview;
