import React, { Component } from 'react';
// import { CSSTransition } from 'react-transition-group';
// import { observer } from 'mobx-react';
import {
  Generator
} from 'components';
import './styles.scss';

// @observer
export default class Generate extends Component {
  componentWillMount () {}

  render() {
    return <div className='generate'>
      <Generator />
    </div>;
  }
}
