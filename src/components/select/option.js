import React, { Component } from 'react';
// import _ from 'lodash';
// import { observable } from 'mobx';
// import { observer } from 'mobx-react';
// import classnames from 'classnames';
import './styles.scss';

// @observer
export default class Option extends Component {
  static defaultProps = {
    value: 0,
    onClick: () => {}
  }

  render() {
    return <div className='option' onClick={() => this.onClick()}>
      {this.props.children}
    </div>;
  }

  onClick () {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(this.props.value);
    }
  }
}
