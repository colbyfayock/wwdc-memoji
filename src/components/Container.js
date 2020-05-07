import React from 'react';
import PropTypes from 'prop-types';

const Container = ({children, type}) => {
  let containerClass = 'container';

  if ( type ) {
    containerClass = `${containerClass} container-${type}`;
  }

  return (
    <div className={containerClass}>
      { children }
    </div>
  );
};

Container.propTypes = {
  children: PropTypes.node,
};

export default Container;