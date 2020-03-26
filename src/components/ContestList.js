import React from 'react';
import PropTypes from 'prop-types';
import ContestPreview from "./ContestPreview";

const ContestList = ({contests,onContestClick}) => (
  <div className="ContestList">
    {Object.keys(contests).map(itemId => (
      <ContestPreview 
      key={itemId} 
      onClick={onContestClick}
      {...contests[itemId]} />
    ))}
  </div>
);

ContestList.propTypes = {
    contests: PropTypes.object,
    onContestClick: PropTypes.func.isRequired
};

export default ContestList;
