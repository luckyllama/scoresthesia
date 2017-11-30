import _ from 'lodash';
import MusicUtil from 'lib/music-util';
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
        .catch(err => {
          console.log('error loading file', this.fileUrl, err);
          reject();
        });
    });
  }

  parseXml (xmlText) {
    let xml = $.parseXML(xmlText);
    let $score = $('score-partwise', xml);

    this.parts
    _.each($('part', $score), partData => {
      let measures = [];

      let currentAttributes = {};
      _.each($('measure', partData), measureData => {
        let measure = new Measure(measureData, currentAttributes);
        currentAttributes = _.last(measure.attributes);
        measures.push(measure);
      });

    });
  }
}

export class Measure {
  rawData;
  number = -1;
  attributes = [];

  constructor (measureData, currentAttributes) {
    this.rawData = measureData;
    this.number = _.toNumber($(measureData).attr('number'));

    _.each($(measureData).children(), child => {
      let $child = $(child);
      if ($child.is('attributes')) {
        this.attributes.push(new MeasureAttributes($child, currentAttributes));
      } else if ($child.is('note')) {

      }
    });

    if (this.attributes.length == 0) { this.attributes.push(currentAttributes); }
    console.log('attributes =', this.attributes)

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
      let keyNum = $('fifths', $key).text();
      this.key = {
        keyNum,
        keyName: MusicUtil.numToKey(keyNum),
        mode: $('mode', $key).text(),
      };
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

}
