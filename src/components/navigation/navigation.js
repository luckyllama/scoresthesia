import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router';
import PropTypes from 'prop-types'
// import _ from 'lodash';
// import { observer } from 'mobx-react';
import classnames from 'classnames';
import './styles.scss';

class Navigation extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  }

  componentWillMount () {}
  componentDidMount () {}

  render () {
    let globalClasses = classnames('global');
    return (
      <nav className={globalClasses}>
        <ul>
          <li className='home'><Link to='/'>scoresthesia</Link></li>
          {/* <li><Link to='home'>browse</Link></li> */}
          <li><Link to='generate'>create</Link></li>
          <li><Link to='about'>what?</Link></li>
        </ul>
      </nav>
    );
  }

}

export default withRouter(Navigation);
