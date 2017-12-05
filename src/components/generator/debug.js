import React, { Component } from 'react';
import _ from 'lodash';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import './styles.scss';

@observer
export default class Debug extends Component {
  static defaultProps = {}

  @observable data;

  componentWillMount () {
    this.componentWillReceiveProps(this.props);
  }
  componentWillReceiveProps (props) {}

  render() {
    if (_.isEmpty(this.data)) {
      return <div className='generator loading'>loading</div>
    }

    return <div className='generator'>
      generate tbd
    </div>;
  }
}

export class DebugOptions extends Component {

  render () {
      return <div className='debug-options'>
        todo
      </div>;
  }
}
