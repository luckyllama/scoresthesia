import React, { Component } from 'react';
import _ from 'lodash';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import MusicData from 'lib/music-data';
import './styles.scss';

@observer
export default class Generator extends Component {
  static defaultProps = {
    filePath: 'data/frederic-chopin-nocturne-op9-no2.xml',
  }

  @observable data;

  componentWillMount () {
    this.componentWillReceiveProps(this.props);
  }
  componentWillReceiveProps (props) {
    if (_.isEmpty(this.data) || this.props.filePath !== props.filePath) {
      let newData = new MusicData(props.filePath);
      newData.load()
        .then(() => {
          this.data = newData;
        })
        .catch(err => console.log(err));
    }
  }

  render() {
    if (_.isEmpty(this.data)) {
      return <div className='generator loading'>loading</div>
    }

    return <div className='generator'>
      generate tbd
    </div>;
  }
}
