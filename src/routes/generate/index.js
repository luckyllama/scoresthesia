import React, { Component } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
// import { CSSTransition } from 'react-transition-group';
import { observable, action, reaction } from 'mobx';
import { observer } from 'mobx-react';
import * as Generator from 'components/generator';
import { Select, SelectOption } from 'components/select';
import MusicData from 'lib/music-data';
import './styles.scss';

export default class Generate extends Component {
  state = {
    settingsActive: false,
    filePath: '',
    data: {},
    isLoading: false,
    generatorIndex: 0,
  };

  componentWillMount () {
    // this.filePathReactionDispose = reaction(() => this.filePath, path => this.loadData() );
    // temp
    // this.filePath = 'data/frederic-chopin-nocturne-op9-no2.xml';
    this.setState({ filePath: 'data/music-xml-test.xml' });
    this.loadData();
  }
  componentWillUnmount () {
    // this.filePathReactionDispose();
  }

  // @action
  loadData () {
    if (_.isEmpty(this.state.filePath)) { return; }

    let newData = new MusicData(this.state.filePath);
    this.setState({ isLoading: true });
    newData.load()
      .then(() => {
        this.setState({ data: newData, isLoading: false });
      })
      .catch(err => console.log(err));
  }

  render() {
    let generatorData = Generator.MetaData[this.state.generatorIndex];
    let GeneratorOptions = generatorData.options;
    let SelectedGenerator = generatorData.generator;

    let settingsHeight = this.state.settingsActive ? _.get(this.settingsContentsDiv, 'clientHeight', 0) : 0;
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

      <div className={classnames('settings-container', { active: this.state.settingsActive })} style={{maxHeight: settingsHeight+'px'}}>
        <h3 ref={el => this.settingsHeader = el} onClick={() => this.state.settingsActive = !this.state.settingsActive}>settings</h3>
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

      <div className={classnames('output', { 'is-loading': this.state.isLoading })}>
        {this.state.isLoading ?
         <div className='loading-message'>loading</div> :
         <SelectedGenerator data={this.state.data} />
        }
      </div>
    </div>;
  }

  onFilePathChange () {
    this.state.filePath = this.refs.filePathSelect.value;
  }

  onGeneratorChange () {

  }
}