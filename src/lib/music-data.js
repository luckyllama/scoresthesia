import _ from 'lodash';
import { Note as NoteInfo } from 'tonal';
import * as Key from 'tonal-key';
const $ = window.$;

export default class MusicData {
  fileUrl = '';
  rawData = {};

  constructor (fileUrl) {
    this.fileUrl = fileUrl;
  }

  load () {
    return new Promise((resolve, reject) => {
      fetch('data/frederic-chopin-nocturne-op9-no2.xml')
        .then(response => response.text())
        .then(xmlText => this.parseXml(xmlText))
        .then(() => resolve())
        .catch(err => {
          console.log('error loading file', this.fileUrl, err);
          reject();
        });
    });
  }

  parseXml (xmlText) {
    let xml = $.parseXML(xmlText);
    let $score = $('score-partwise', xml);

    // this.parts
    _.each($('part', $score), partData => {
      let measures = [];

      let currentAttributes = {};
      _.each($('measure', partData), measureData => {
        let measure = new Measure(measureData, currentAttributes);
        currentAttributes = _.last(measure.attributes);
        measures.push(measure);
      });
      console.log('all measures',measures);

    });
  }
}

export class Measure {
  rawData;
  number = -1;
  attributes = [];
  notes = new Map();
  pitchCount = new Map();

  constructor (measureData, currentAttributes) {
    this.rawData = measureData;
    this.number = _.toNumber($(measureData).attr('number'));

    _.each($(measureData).children(), child => {
      let $child = $(child);

      if ($child.is('attributes')) {
        this.attributes.push(new MeasureAttributes($child, currentAttributes));
      } else if ($child.is('note')) {
        let newNote = new Note($child);
        this.notes.set({ staff: newNote.staff, voice: newNote.voice }, newNote);

        if (newNote.isRest === false) {
          this.pitchCount.set(newNote.pitch.pc,
            this.pitchCount.has(newNote.pitch.pc) ? this.pitchCount.get(newNote.pitch.pc) + 1 : 1);
        }

      }
    });

    // keep track of current attributes if this measure doesn't update them
    if (this.attributes.length === 0) { this.attributes.push(currentAttributes); }

  }
}

export class MeasureAttributes {
  divisions = 0;
  staves = 0;
  clefs = {};
  key = {};
  time = {};

  constructor (data, previousAttributes) {
    Object.assign(this, previousAttributes);
    if (_.isEmpty(data)) { return; }

    let divisionsText = $('divisions', data).text();
    if (!_.isEmpty(divisionsText)) { this.divisions = _.toNumber(divisionsText) }

    let stavesText = $('staves', data).text();
    if (!_.isEmpty(stavesText)) { this.staves = _.toNumber(stavesText) }

    let $clefs = $('clef', data);
    _.each($clefs, clef => {
      let clefNumber = $(clef).attr('number');
      this.clefs[clefNumber] = {
        number: clefNumber,
        sign: $('sign', clef).text(),
        line: $('line', clef).text(),
        octaveChange: $('clef-octave-change', clef).text(),
      };
    });

    let $key = $('key', data);
    if (!_.isEmpty($key)) {
      let keyNum = _.toNumber($('fifths', $key).text());
      this.key = {
        keyNum,
        keyName: Key.fromAlter(keyNum),
        mode: $('mode', $key).text(),
      };
      console.log('key =', this.key)
    }

    let $time = $('time', data);
    if (!_.isEmpty($time)) {
      this.time = {
        beats: $('beats', $time).text(),
        beatTime: $('beat-type', $time).text(),
      }
    }
  }
}

export class Note {
  rawData = {};
  duration = 0;
  type = 'whole';
  staff = 1;
  voice = 'default';
  pitch = { step: 'C', octave: 0 };
  isRest = false;
  isGrace = false;
  isChord = false;
  tie;

  constructor (noteData) {
    this.rawData = noteData;

    this.duration = _.toNumber($('duration', noteData).text());

    this.type = $('type', noteData).text();

    this.staff = _.toNumber($('staff', noteData).text());

    this.voice = $('voice', noteData).text();

    let $pitch = $('pitch', noteData);
    if (!_.isEmpty($pitch)) {
      let pitch = {
        step: $('step', $pitch).text(),
        alter: NoteInfo.altToAcc(_.toNumber($('alter', $pitch).text())),
        octave: _.toNumber($('octave', $pitch).text()),
      };
      this.pitch = Object.assign({}, NoteInfo.props(`${pitch.step}${pitch.alter}${pitch.octave}`));
      this.pitch.prettyPrint = () => {
        return this.pitch.pc;
      }
    }

    this.isChord = $('chord', noteData).length !== 0;

    this.isRest = $('rest', noteData).length !== 0;
    if (this.isRest && _.isEmpty(this.type)) {
      this.type = 'whole';
    }

    this.isGrace = $('grace', noteData).length !== 0;
    // give a small duration to grace notes (musicxml defines gives them 0)
    if (this.isGrace) { this.duration = 1; }

    this.tie = $('tie', noteData).attr('type');
  }

  toString () {
    return
  }
}
