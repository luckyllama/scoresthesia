import React, { Component } from 'react';
import _ from 'lodash';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import './styles.scss';

@observer
export default class Debug extends Component {
  static defaultProps = {
    data: {},
    measuresPerPage: 4,
  }

  @observable data;
  @observable currentPage = 0;

  componentWillMount () {
    this.componentWillReceiveProps(this.props);
  }
  componentWillReceiveProps (props) {
    this.data = props.data;
  }

  render() {
    if (_.isEmpty(this.data)) {
      return <div className='generator error'>no music data given</div>
    }

    // let measures =
    return <div className='generator'>
      generate tbd
    </div>;
  }
}

class DebugOptions {
  @observable todo = '';
}
const debugState = new DebugOptions();

export class DebugOptionsView extends Component {

  render () {
      return <div className='debug-options'>
        todo
      </div>;
  }
}
