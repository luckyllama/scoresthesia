import _ from 'lodash';
import { Note as NoteInfo } from 'tonal';
import * as Key from 'tonal-key';
const $ = window.$;

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
      + (this.hasPickupMeasure && page > 0) ? 1 : 0;
    let endMeasure = startMeasure + pageSize
      + (this.hasPickupMeasure ? 1 : 0);
    return this.measures.slice(startMeasure, endMeasure);
  }
}

export class Measure {
  xml;
  number = -1;
  attributes = [];
  notes = new Map();
  pitchCount = new Map();

  constructor (xml, currentAttributes) {
    this.xml = xml;
    this.number = _.toNumber($(xml).attr('number'));
    this.implicit = $(xml).attr('implicit') === 'yes';

    _.each($(xml).children(), child => {
      let $child = $(child);

      if ($child.is('attributes')) {
        this.attributes.push(new MeasureAttributes(child, currentAttributes));
      } else if ($child.is('note')) {
        let newNote = new Note(child);
        this.notes.set({ staff: newNote.staff, voice: newNote.voice }, newNote);

        if (!newNote.rest) {
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
    if (typeof data !== 'object') { return;}
    // console.log(data, _.isEmpty(data), typeof data )
    // if (_.isEmpty(data)) { return; }

    let parsed = xmlToObject(data);

    if (parsed.key) {
      parsed.key.name = Key.fromAlter(parsed.key.fifths);
    }

    if (parsed.clef && parsed.clef.length > 0) {
      parsed.clefs = {};
      _.each(parsed.clef, clef => {
        parsed.clefs[clef['@number']] = clef;
      });
      delete parsed.clef;
    }

    Object.assign(this, parsed);
  }
}

export class Note {
  xml = {};

  constructor (noteXml) {
    this.xml = noteXml;

    // convert xml to object which will be assigned to this object

    let note = xmlToObject(noteXml);

    // add additional pitch info not stored in musicxml
    if (!_.isEmpty(note.pitch)) {
      let convertedAlter = NoteInfo.altToAcc(note.pitch.alter);
      note.pitch = Object.assign({}, NoteInfo.props(`${note.pitch.step}${convertedAlter}${note.pitch.octave}`));
      note.pitch.prettyPrint = () => {
        return note.pitch.pc;
      }
    }

    // might not be needed in musicxml 3.0 but was in 2.0
    if (note.rest && _.isEmpty(note.type)) {
      note.type = 'whole';
    }

    // give a small duration to grace notes (musicxml defines gives them 0)
    if (note.grace) { note.duration = 1; }

    Object.assign(this, note);
  }

  toString () {
    // return
  }
}
