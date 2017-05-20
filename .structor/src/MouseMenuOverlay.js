import React, { Component } from 'react';
import MouseMenu, {MENU_WIDTH, MENU_HEIGHT} from './MouseMenu';

class MouseMenuOverlay extends Component {

  constructor (props) {
    super(props);
    this.setPosition = this.setPosition.bind(this);
    this.state = {
      showMenu: false,
      mousePos: {},
    };
  }

  componentDidMount () {
    this.bodyWidth = document.body.clientWidth;
    this.bodyHeight = document.body.clientHeight;
    const {context} = this.props;
    if (context) {
      context.addListener('mouseDown.mousemenu', this.setPosition);
    }
  }

  componentWillUnmount () {
    this.$DOMNode = undefined;
    const {context} = this.props;
    if (context) {
      context.removeListener('mouseDown.mousemenu');
    }
  }

  setPosition (e) {
    const {pageX, pageY, button} = e;
    this.setState({
      showMenu: button === 2,
      mousePos: {pageX, pageY, button},
    });
  }

  render () {
    const {showMenu, mousePos: {pageX, pageY}} = this.state;
    if (!showMenu) {
      return null;
    }
    const windowWidth = window.innerWidth + window.scrollX;
    const windowHeight = window.innerHeight + window.scrollY;
    const widthDelta = windowWidth - pageX;
    const heightDelta = windowHeight - pageY;
    let position = {horizontal: 'right', vertical: 'bottom'};
    if (widthDelta < MENU_WIDTH) {
      position.horizontal = 'left';
    }
    if (pageY - window.scrollY > MENU_HEIGHT && heightDelta < MENU_HEIGHT) {
      position.vertical = 'top';
    }
    return (
      <MouseMenu
        centerPointY={pageY}
        centerPointX={pageX}
        componentName={"Test"}
        position={position}
      />
    );
  }
}

export default MouseMenuOverlay;
