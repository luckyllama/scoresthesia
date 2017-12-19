import _ from 'lodash';
import { Note as NoteInfo } from 'tonal';
import * as Key from 'tonal-key';
const $ = window.$;

const ClefNames = {
  'G': 'treble',
  'F': 'bass',
  'C': 'alto',
  'percussion': 'percussion',
  'TAB': 'tab'
};

let xmlToObject = node => {
  let result = {};
  _.each(node.attributes, attr =>
    result[`@${attr.nodeName}`] = isFinite(attr.value) ? _.toNumber(attr.value) : attr.value
  );
  _.each(node.children, child => {
    if (!_.isEmpty(result[child.nodeName])) {
      result[child.nodeName] = [result[child.nodeName]];
      result[child.nodeName].push(xmlToObject(child));
    } else {
      result[child.nodeName] = xmlToObject(child);
    }
  });
  let value = node.textContent;
  value = _.isEmpty(value) ? true : isFinite(value) ? _.toNumber(value) : value;

  return _.isEmpty(result) ? value : result;
};

export default class MusicData {
  fileUrl = '';
  xml = {};
  parts = {
    count: 0,
  };
  measures = [];
  hasPickupMeasure = false;

  constructor (fileUrl) {
    this.fileUrl = fileUrl;
  }

  load () {
    return new Promise((resolve, reject) => {
      fetch(this.fileUrl)
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
    if ($score.length === 0) { throw Error('Only "score-partwise" files are supported.')}

    _.each($('part-list score-part', $score), partData => {
      let part = xmlToObject(partData);
      this.parts[part['@id']] = part;
      this.parts.count++;
    });

    _.each($('part', $score), partData => {
      let measures = [];

      let currentAttributes = {};
      _.each($('measure', partData), xml => {
        let measure = new Measure(xml, currentAttributes);
        currentAttributes = _.last(measure.attributes);
        measures.push(measure);
      });
      this.measures = measures;
      this.hasPickupMeasure = this.measures[0].implicit;
    });
  }

  getMeasuresByPage (page, pageSize) {
    let startMeasure = (page * pageSize)
    //   + (this.hasPickupMeasure && page > 0) ? 1 : 0;
    let endMeasure = startMeasure + pageSize
    //   + (this.hasPickupMeasure ? 1 : 0);
    return this.measures.slice(startMeasure, endMeasure);
  }
}

export const Barlines = {
  Standard: 'standard',
  RepeatStart: 'repeat-start',
  RepeatEnd: 'repeat-end',
};

export class Measure {
  xml;
  number = -1;
  attributes = [];
  barlines = {
    left: Barlines.Standard,
    right: Barlines.Standard
  }
  //notes = [staff: [voice: [ [notes], [notes], ... ] ] ]
  notes = [];
  children = [];
  pitchCount = {};

  constructor (xml, currentAttributes) {
    this.xml = xml;
    this.number = _.toNumber($(xml).attr('number'));
    this.width = _.toNumber($(xml).attr('width'));
    this.implicit = $(xml).attr('implicit') === 'yes';

    this.children = _.map(xml.children, child => {
      let data = xmlToObject(child);
      data['@@nodeName'] = child.nodeName;
      return data;
    });

    this._processBarlines();
    this._processAttributes(currentAttributes);
    this._processNotes();
    this._processMetadata();

    console.log('measure', this,'children', this.children)
    // let children = [];
    // _.each($(xml).children(), child => {
    //   if (child.nodeName === 'barline') {
    //     this.processBarline(child);
    //   } else if (child.nodeName === 'attributes') {
    //     this.attributes.push(new MeasureAttributes(child, currentAttributes));
    //   } else if ($child.is('note')) {
    //     if ($child.has('rest').length > 0) {
    //       children.push(new Rest(child));
    //     } else {
    //       let newNote = new Note(child);
    //       this.pitchCount[newNote.pitch.pc] =
    //         this.pitchCount[newNote.pitch.pc] ? this.pitchCount[newNote.pitch.pc] + 1 : 1;
    //     }
    //     // this.notes.set({ staff: newNote.staff, voice: newNote.voice }, newNote);
    //   } else if ($child.is('direction')) {
    //
    //   } else if ($child.is('backup')) {
    //     /*ignored*/
    //   }
    // });
    // _.each(children, child => {
    //   this.notes[child.staff] = _.defaultTo(this.notes[child.staff], []);
    //   this.notes[child.staff][child.voice] = _.defaultTo(this.notes[child.staff][child.voice], []);
    //
    //   if (child.chord) {
    //     this.notes[child.staff][child.voice]
    //   } else {
    //     this.notes[child.staff][child.voice].push([child]);
    //   }
    //
    // })
    //
    // // keep track of current attributes if this measure doesn't update them
    // if (this.attributes.length === 0) { this.attributes.push(currentAttributes); }

  }

  _processBarlines () {
    let barlines = _.filter(this.children, ['@@nodeName', 'barline']);
    _.each(barlines, barline => this.barlines[barline['@location']] = barline);
  }
  _processAttributes (currentAttributes) {
    let attributes = _.filter(this.children, ['@@nodeName', 'attributes']);
    this.attributes = _.transform(attributes, (result, attribute) => {
      let previous = _.defaultTo(result.slice(-1)[0], currentAttributes);
      console.log('found attribute', attribute, previous,currentAttributes)
      result.push(new MeasureAttributes(attribute, previous));
      console.log('result = ', result)
    }, []);

    if (this.attributes.length === 0) { this.attributes.push(currentAttributes); }
  }
  _processNotes () {

  }
  _processMetadata () {}
}

export class MeasureAttributes {
  divisions = 0;
  staves = 0;
  clefs = {};
  key = {};
  time = {};

  constructor (data, previousAttributes) {
    Object.assign(this, previousAttributes);
    if (typeof data !== 'object' || data['@@nodeName'] !== 'attributes') { return; }

    if (data.key) {
      data.key = Object.assign({}, data.key, Key.props(Key.fromAlter(data.key.fifths)));
    }

    if (data.clef && data.clef.length > 0) {
      data.clefs = _.map(data.clef, clef => {
        clef.name = _.defaultTo(ClefNames[clef.sign], 'treble');
        return clef;
      });
      delete data.clef;
    }

    Object.assign(this, data);
  }
}

export class Note {
  xml = {};

  constructor (noteXml) {
    this.xml = noteXml;

    // convert xml to object which will be assigned to this object
    let note = xmlToObject(noteXml);
    if (note.rest) {
      console.error('Cannot create note. Data is a rest.')
    }

    // add additional pitch info not stored in musicxml
    if (!_.isEmpty(note.pitch)) {
      let convertedAlter = NoteInfo.altToAcc(note.pitch.alter);
      note.pitch = Object.assign({}, NoteInfo.props(`${note.pitch.step}${convertedAlter}${note.pitch.octave}`));
      note.pitch.prettyPrint = () => {
        return note.pitch.pc;
      }
    }

    // give a small duration to grace notes (musicxml defines gives them 0)
    if (note.grace) { note.duration = 1; }

    Object.assign(this, note);
  }

  toString () {
    // return
  }
}

export class Rest {
  xml = {};
  constructor (noteXml) {
    this.xml = noteXml;
    let rest = xmlToObject(noteXml);
    if (!rest.rest) {
      console.error('Cannot create rest. Data is a note.');
      return;
    }
    // might not be needed in musicxml 3.0 but was in 2.0
    if (_.isEmpty(rest.type)) {
      rest.type = 'whole';
    }
    Object.assign(this, rest);
  }
}
