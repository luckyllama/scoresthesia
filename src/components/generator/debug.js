import React, { Component } from 'react';
import _ from 'lodash';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import MeasureDisplay from './measure-display';
import './styles.scss';

@observer
export default class Debug extends Component {
  static defaultProps = {
    data: {},
    measuresPerLine: 4,
  }

  @observable data;
  currentPage = 0;
  @observable measures = [];
  measuresPerLine = 4;
  measuresPerPage = 4;

  componentWillMount () {
    this.componentWillReceiveProps(this.props);
  }
  componentWillReceiveProps (props) {
    this.data = props.data;
    this.measuresPerLine = props.measuresPerLine || 4;
    this.measuresPerPage = this.data.parts.count > 2 ? this.measuresPerLine : this.measuresPerLine * 2;
    this.measures = this.data.getMeasuresByPage(this.currentPage, this.measuresPerPage);
    console.log(this.measures)
  }

  componentDidMount () { this.componentDidUpdate(); }
  componentDidUpdate () {
    // _.each(this.measures, (measure, index) => this.displayMeasure(measure,index));
  }

  // displayMeasure (measure, index) {
  //   let renderer = new vf.Renderer(`vex_${index}`, vf.Renderer.Backends.SVG);
  //   let context = renderer.getContext();
  //
  //   console.log('rendering measure', measure);
  //   let isStart = index === 0;
  //   let isStartOfLine = index % this.measuresPerLine === 0;
  //
  //   let attributes = measure.attributes[0];
  //   let staves = [];
  //   let staffSpacer = 110;
  //   let measureWidth = 300;
  //   _.each(_.range(attributes.staves), staffIndex => {
  //     let staff = new vf.Stave(isStart ? 10 : 0, 10 + (staffIndex * staffSpacer), measureWidth - (isStart ? 10 : 0));
  //     if (isStartOfLine) {
  //       let clef = attributes.clefs[staffIndex];
  //       staff.addClef(clef.name);
  //       staff.addKeySignature(attributes.key.tonic);
  //       if (isStart) { staff.addTimeSignature(`${attributes.time.beats}/${attributes.time['beat-type']}`); }
  //     }
  //     staff.setContext(context).draw();
  //     staves.push(staff);
  //   });
  //   if (isStartOfLine) {
  //     _.each(staves, (staff, staffIndex) => {
  //       let nextStaff = staves[staffIndex + 1];
  //       if (nextStaff) {
  //         let connector = new vf.StaveConnector(staff, nextStaff);
  //         let type = measure.number === 0 ? vf.StaveConnector.type.DOUBLE : vf.StaveConnector.type.SINGLE;
  //         connector.setType(type);
  //         connector.setContext(context).draw();
  //       }
  //     });
  //   }
  //
  //   renderer.resize(measureWidth, (attributes.staves * staffSpacer) + 20);
  //   // stave.setContext(context).draw();
  // }

  render() {
    if (_.isEmpty(this.data)) {
      return <div className='generator error'>no music data given</div>
    }
    return <div className={classnames('generator')}>
      <div className='music-display'>
        <header>
          <h4>Measures {this.measures[0].number}-{this.measures.slice(-1)[0].number}</h4>
          <div className='controls previous'><i className='icon icon-arrow-left' /> previous</div>
          <div className='controls next'>next <i className='icon icon-arrow-right' /></div>
        </header>
        <div className='measures'>
          {/* {_.map(this.measures, (measure, index) =>
            <MeasureDisplay key={`measure-${measure.number}`} measure={measure}
              startSystem={index % this.measuresPerLine === 0} />
          )} */}
        </div>
      </div>
    </div>;
    /* <div key={`measure-${measure.number}`}
    className={classnames('measure', { pickup: measure.implicit, 'new-line': index % this.measuresPerLine === 0 })}
    >
    <div id={`vex_${index}`} className='score'></div>
    <span className='number'>{measure.number}</span>
    </div> */
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
