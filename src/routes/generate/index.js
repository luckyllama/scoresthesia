import React, { Component } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
// import { CSSTransition } from 'react-transition-group';
import { observable, action, reaction } from 'mobx';
import { observer } from 'mobx-react';
import * as Generator from 'components/generator';
import {
  Select, SelectOption
} from 'components';
import MusicData from 'lib/music-data';
import './styles.scss';

@observer
export default class Generate extends Component {
  @observable settingsActive = true;
  @observable filePath;
  @observable data;
  @observable isLoading = false;
  @observable generatorIndex = 0;

  componentWillMount () {
    this.filePathReactionDispose = reaction(() => this.filePath, path => this.loadData() );
    // temp
    this.filePath = 'data/frederic-chopin-nocturne-op9-no2.xml';
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
    let generatorData = Generator.MetaData[this.generatorIndex];
    let GeneratorOptions = generatorData.options;

    let settingsHeight = this.settingsActive ? _.get(this.settingsContentsDiv, 'clientHeight', 0) : 0;
    let headerHeight = _.get(this.settingsHeader, 'clientHeight', 0);
    settingsHeight += headerHeight;

    let fileOptions = [
      <SelectOption value='data/frederic-chopin-nocturne-op9-no2.xml'>Chopin, Frederic - Nocturne in E♭ Major, Op.9 No.2</SelectOption>,
      <SelectOption value='data/nyi.xml'>Test</SelectOption>,
    ];

    let generatorOptions = _.map(Generator.MetaData, (generator, index) =>
      <SelectOption value={index}>{generator.name}</SelectOption>
    );

    return <div className='generate'>

      <div className={classnames('settings-container', { active: this.settingsActive })} style={{maxHeight: settingsHeight+'px'}}>
        <h3 ref={el => this.settingsHeader = el} onClick={() => this.settingsActive = !this.settingsActive}>settings</h3>
        <div ref={el => this.settingsContentsDiv = el} className='settings-contents'>
          <div className='fieldset generator'>
            <div className='settings-group'>
              Show me the piece,
                <Select selectedIndex={0} options={fileOptions} />
                rendered with the
                <Select selectedIndex={0} options={generatorOptions} />
                engine.
              </div>
            </div>
          {GeneratorOptions ?
            <div className='fieldset generator'>
              <div className='legend'>generator options</div>
              <div className='settings-group'>
                <GeneratorOptions />
              </div>
            </div>
          : null }
        </div>
      </div>

      <div className={classnames('output', { 'is-loading': this.isLoading })}>
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

  onGeneratorChange () {

  }
}
