import React, { Component } from 'react';

export const MENU_WIDTH = 150;
export const MENU_HEIGHT = 300;

const menuBoxStyle = {
  width: MENU_WIDTH + 'px',
};

class MouseMenu extends Component {

  constructor (props) {
    super(props);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleContextMenu = this.handleContextMenu.bind(this);
    this.handleClearMousePosition = this.handleClearMousePosition.bind(this);
    this.handleSelectParent = this.handleSelectParent.bind(this);
    this.handleBefore = this.handleBefore.bind(this);
    this.handleFirst = this.handleFirst.bind(this);
    this.handleLast = this.handleLast.bind(this);
    this.handleAfter = this.handleAfter.bind(this);
    this.handleReplace = this.handleReplace.bind(this);
    this.handleCut = this.handleCut.bind(this);
    this.handleCopy = this.handleCopy.bind(this);
    this.handleClone = this.handleClone.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleMouseOver (e) {
    // this.props.onMouseOver(e);
  }

  handleMouseOut (e) {
    // this.props.onMouseOut(e);
  }

  handleContextMenu (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  handleClearMousePosition (e) {
    // this.props.onClearMousePosition();
  }

  handleSelectParent (e) {
    // this.props.onSelectParent(e);
  }

  handleBefore (e) {
    // this.props.onBefore(e);
  }

  handleFirst (e) {
    // this.props.onFirst(e);
  }

  handleLast (e) {
    // this.props.onLast(e);
  }

  handleAfter (e) {
    // this.props.onAfter(e);
  }

  handleReplace (e) {
    // this.props.onReplace(e);
  }

  handleCut (e) {
    // this.props.onCut(e);
  }

  handleCopy (e) {
    // this.props.onCopy(e);
  }

  handleClone (e) {
    // this.props.onClone(e);
  }

  handleDelete (e) {
    // this.props.onDelete(e);
  }

  render () {
    const {componentName, centerPointY, centerPointX, position} = this.props;
    const componentLabel = componentName && componentName.length > 20 ?
      componentName.substr(0, 20) + '...' : componentName;
    let top = centerPointY;
    let left = centerPointX;
    if (position) {
      const {horizontal, vertical} = position;
      if (horizontal === 'left') {
        left -= MENU_WIDTH;
      }
      if (vertical === 'top') {
        top -= MENU_HEIGHT;
      }
    }
    return (
      <div
        className="structor_mouse-center-point"
        style={{top, left}}
        onContextMenu={this.handleContextMenu}
      >

        <div
          className="structor_selected-overlay-menu-box"
          style={menuBoxStyle}
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
        >
          <div
            className="structor_selected-overlay-menu-item"
            onClick={this.handleSelectParent}
          >
            <div className="umy-icon-arrow-up-left structor_selected-overlay-menu-item-icon"/>
            Select parent
          </div>
          <div className="structor_selected-overlay-menu-divider"/>
          <div
            className="structor_selected-overlay-menu-item"
            title="Close menu"
            onClick={this.handleClearMousePosition}
          >
            <div className="umy-icon-cancel-circle structor_selected-overlay-menu-item-icon"/>
            <div>{componentLabel}</div>
          </div>
          <div className="structor_selected-overlay-menu-divider"/>
          <div
            className="structor_selected-overlay-menu-item"
            onClick={this.handleCopy}
          >
            <div className="umy-icon-copy structor_selected-overlay-menu-item-icon"/>
            Copy
          </div>
          <div
            className="structor_selected-overlay-menu-item"
            onClick={this.handleCut}
          >
            <div className="umy-icon-cut structor_selected-overlay-menu-item-icon"/>
            Cut
          </div>
          <div className="structor_selected-overlay-menu-divider"/>
          <div className="structor_selected-overlay-menu-paste-box">
            <div
              className="structor_selected-overlay-menu-add-placeholder"
              onClick={this.handleBefore}
            >
              + Before
            </div>
            <div className="structor_selected-overlay-menu-paste-component">
              <div
                className="structor_selected-overlay-menu-add-placeholder"
                onClick={this.handleFirst}
              >
                + First
              </div>
              <div
                className="structor_selected-overlay-menu-replace-placeholder umy-icon-replace"
                title="Replace"
                onClick={this.handleReplace}
              />
              <div
                className="structor_selected-overlay-menu-add-placeholder"
                onClick={this.handleLast}
              >
                + Last
              </div>
            </div>
            <div
              className="structor_selected-overlay-menu-add-placeholder"
              onClick={this.handleAfter}
            >
              + After
            </div>
          </div>
          <div className="structor_selected-overlay-menu-divider"/>
          <div
            className="structor_selected-overlay-menu-item"
            onClick={this.handleDelete}
          >
            <div className="umy-icon-delete structor_selected-overlay-menu-item-icon"/>
            Delete
          </div>
        </div>
      </div>
    );
  }
}

export default MouseMenu;
