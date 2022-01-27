import React from 'react';
import PropTypes from 'prop-types';

export default function Divider({ children }) {
  return <span className="react-date-picker__inputGroup__divider">{children}</span>;
}

Divider.propTypes = {
  children: PropTypes.node,
};
