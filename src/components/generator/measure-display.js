import React, { Component } from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import Vex from 'vexflow';
import './styles.scss';
const vf = Vex.Flow;

const VexConvert = {
  duration: {
    'whole': 'n',
    'half': 'h',
    'quarter': 'q',
    'eighth': '8',
    '16th': '16',
    '32nd': '32',
  }
};

export default class MeasureDisplay extends Component {
  static defaultProps = {
    measure: {},
    startSystem: false,
  };

  state = {
    measure: {},
    startSystem: false,
  };

  componentWillMount () {
    this.componentWillReceiveProps(this.props);
  }
  componentWillReceiveProps (props) {
    this.setState({ measure: props.measure, startSystem: props.startSystem });
  }

  componentDidMount () { this.componentDidUpdate(); }
  componentDidUpdate () {
    this.displayMeasure();
  }

  displayMeasure () {
    let { measure, startSystem } = this.state;

    let renderer = new vf.Renderer(`vex_${measure.number}`, vf.Renderer.Backends.SVG);
    let context = renderer.getContext();

    console.log('rendering measure', measure, startSystem);

    let notesByStaff = {};
    measure.notes.forEach((note, key) => {
      if (measure.number === 0) { console.log('notebystaff', notesByStaff[key.staff], notesByStaff[key.staff] || [], note); }
      notesByStaff[key.staff] = notesByStaff[key.staff] || [];
      notesByStaff[key.staff].push(note);
    });

    let attributes = measure.attributes[0];
    let staffSpacer = 110;
    let measureWidth = 300;
    // draw staff, clef, key, time,
    let staves = [];
    _.each(_.range(attributes.staves), staffIndex => {
      let staff = new vf.Stave(startSystem ? 10 : 0, 10 + (staffIndex * staffSpacer), measureWidth - (startSystem ? 10 : 0));
      let clef = attributes.clefs[staffIndex];
      if (startSystem) {
        staff.addClef(clef.name);
        staff.addKeySignature(attributes.key.tonic);
        staff.addTimeSignature(`${attributes.time.beats}/${attributes.time['beat-type']}`);
      }
      staff.setContext(context).draw();
      staves.push(staff);

      let staffNotes = notesByStaff[staffIndex];
      let vexNotes = _.map(notesByStaff[staffIndex], note => {
        let noteInfo = {
          clef: clef.name,
          keys: [note.rest ? 'b/4' : `${note.pitch.pc.toLowerCase()}/${note.pitch.oct}`],
          duration: `${VexConvert.duration[note.type]}${note.rest ? 'r':''}`
        };
        if (measure.number === 0) { console.log('note info', noteInfo, notesByStaff[staffIndex]); }
        return new vf.StaveNote(noteInfo)
      });

      // let voice = new vf.Voice({num_beats: 4,  beat_value: 4});
      // voice.addTickables(notes);
      vf.Formatter.FormatAndDraw(context, staff, vexNotes);
      // let formatter = new vf.Formatter().joinVoices([voice]).format([voice]);

      // Render voice
      // voice.draw(context, staff);
    });
    // draw staff connector
    if (startSystem) {
      _.each(staves, (staff, staffIndex) => {
        let nextStaff = staves[staffIndex + 1];
        if (nextStaff) {
          let connector = new vf.StaveConnector(staff, nextStaff);
          let type = measure.number === 0 ? vf.StaveConnector.type.DOUBLE : vf.StaveConnector.type.SINGLE;
          connector.setType(type);
          connector.setContext(context).draw();
        }
      });
    }

    renderer.resize(measureWidth, (attributes.staves * staffSpacer) + 20);
    // stave.setContext(context).draw();
  }

  render() {
    let { measure, startSystem } = this.state;
    if (_.isEmpty(measure)) {
      return <div className='measure unloaded'>no measure given</div>
    }
    return <div key={`measure-${measure.number}`}
      className={classnames('measure', { pickup: measure.implicit, 'new-line': startSystem })}
    >
      <div id={`vex_${measure.number}`} className='score'></div>
      <span className='number'>{measure.number}</span>
    </div>;
  }
}