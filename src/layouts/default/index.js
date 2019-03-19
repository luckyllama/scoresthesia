import React from 'react';
import classnames from 'classnames';
import { withRouter } from 'react-router';
import Navigation from 'components/navigation'
import './styles.scss';


class DefaultLayout extends React.Component {
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

export default withRouter(DefaultLayout);