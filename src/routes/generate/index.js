import React, { Component } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
// import { CSSTransition } from 'react-transition-group';
import { observable, action, reaction } from 'mobx';
import { observer } from 'mobx-react';
// import {
//   Generator
// } from 'components';
import MusicData from 'lib/music-data';
import './styles.scss';

@observer
export default class Generate extends Component {
  @observable filePath;
  @observable isCombined = false;
  @observable data;
  @observable isLoading = false;

  componentWillMount () {
    this.filePathReactionDispose = reaction(() => this.filePath, path => this.loadData() );
  }
  componentWillUnmount () {
    this.filePathReactionDispose();
  }

  @action
  loadData () {
    if (_.isEmpty(this.filePath)) { return; }

    let newData = new MusicData(this.filePath);
    this.isLoading = true;
    newData.load()
      .then(() => {
        this.data = newData;
        this.isLoading = false;
      })
      .catch(err => console.log(err));
  }

  render() {
    return <div className='generate'>
      <div className='options'>
        <select ref='filePathSelect' onChange={event => this.onFilePathChange(event)}>
          <option value='data/frederic-chopin-nocturne-op9-no2.xml'>Chopin, Frederic - Nocturne in E♭ Major, Op.9 No.2</option>
          <option value='test'>test</option>
        </select>
      </div>
      <div className={classnames('output', { 'is-combined': this.isCombined, 'is-loading': this.isLoading })}>
        {this.isLoading ?
         <div className='loading-message'>loading</div> :

         <div className='generator'></div>
        }
      </div>
    </div>;
  }

  onFilePathChange () {
    this.filePath = this.refs.filePathSelect.value;
  }
}
