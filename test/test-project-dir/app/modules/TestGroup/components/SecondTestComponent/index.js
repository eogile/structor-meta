
/**
 *
 * SecondTestComponent
 *
 */

import React, { Component, PropTypes } from 'react';

class SecondTestComponent extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {
      exampleValue: '',
    };
  }

  render() {
    const {exampleValue} = this.state; // eslint-disable-line
    const {exampleProp} = this.props; // eslint-disable-line
    return (
      <div>
        <h3 style={{ padding: '1em', textAlign: 'center' }}><span>Click on me and start creating a new cool component.</span></h3>
      </div>
      ); // eslint-disable-line
  }
}

SecondTestComponent.propTypes = {
  exampleProp: PropTypes.string,
};
SecondTestComponent.defaultProps = {
  exampleProp: '',
};

export default SecondTestComponent;
