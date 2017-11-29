import React, { Component } from 'react';
import classnames from 'classnames';
// import { observer } from 'mobx-react';
import { withRouter } from 'react-router';
import {
  Navigation,
} from 'components'
import './styles.scss';

@withRouter
// @observer
export default class DefaultLayout extends Component {
  state = {};

  componentDidMount () {}

  render () {
    let pageClasses = classnames('page default');
    return (
      <div className={pageClasses}>

        <Navigation />

        <div id='page-content' className='page-content'>
          {this.props.children}
        </div>
      </div>
    );
  }
}
