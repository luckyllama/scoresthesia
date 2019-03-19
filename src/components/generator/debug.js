import React, { Component } from 'react';
import _ from 'lodash';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import MeasureDisplay from './measure-display';
import './styles.scss';

class Debug extends Component {
  static defaultProps = {
    data: {},
    measuresPerLine: 4,
  }

  state = {
    data: {},
    measures: [],
  };  

  currentPage = 0;
  measuresPerLine = 4;
  measuresPerPage = 4;

  componentWillMount () {
    this.componentWillReceiveProps(this.props);
  }
  componentWillReceiveProps (props) {
    this.measuresPerLine = props.measuresPerLine || 4;
    this.measuresPerPage = props.data.parts.count > 2 ? this.measuresPerLine : this.measuresPerLine * 2;
    this.setState({ 
      data: props.data,
      measures: props.data.getMeasuresByPage(this.currentPage, this.measuresPerPage),
    });
    console.log(this.state.measures)
  }

  componentDidMount () { this.componentDidUpdate(); }
  componentDidUpdate () {
    // _.each(this.state.measures, (measure, index) => this.displayMeasure(measure,index));
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
    if (_.isEmpty(this.state.data)) {
      return <div className='generator error'>no music data given</div>
    }
    return <div className={classnames('generator')}>
      <div className='music-display'>
        <header>
          <h4>Measures {this.state.measures[0].number}-{this.state.measures.slice(-1)[0].number}</h4>
          <div className='controls previous'><i className='icon icon-arrow-left' /> previous</div>
          <div className='controls next'>next <i className='icon icon-arrow-right' /></div>
        </header>
        <div className='measures'>
          {/* {_.map(this.state.measures, (measure, index) =>
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

const debugState = observable({
  todo: '',
});

export class DebugOptionsView extends Component {

  render () {
      return <div className='debug-options'>
        todo
      </div>;
  }
}

let DebugHOC = observer(Debug);
export default DebugHOC;