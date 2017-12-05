import React, { Component } from 'react';
import _ from 'lodash';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import './styles.scss';

@observer
export default class Select extends Component {
  static defaultProps = {
    selectedIndex: 0,
    options: [],
    onChange: () => {},
  }

  @observable isActive = false;
  @observable selectedIndex = 0;

  componentWillMount () {
    this.componentWillReceiveProps(this.props);
  }
  componentWillReceiveProps (props) {
    this.selectedIndex = props.selectedIndex;
  }

  render() {
    return <div className={classnames('select', { active: this.isActive })}>
      <div className='selected option-wrapper' onClick={() => this.isActive = !this.isActive}>
        {this.props.options[this.selectedIndex]}
        <i className='icon icon-arrow-down' />
        <i className='icon icon-arrow-up' />
      </div>
      <div className='option-menu'>
        {_.map(this.props.options, (option, index) =>
          <div
            key={`option-wrapper_${index}`}
            className={classnames('option-wrapper', { selected: index === this.selectedIndex})}
            onClick={() => this.onOptionClick(index) }
          >
            <option.type key={`option_${index}`} {...option.props} />
          </div>
        )}
      </div>
    </div>;
  }

  onOptionClick (index) {
    this.selectedIndex = index;
    this.isActive = false;
  }

  onChange () {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(this.props.options[this.selectedIndex].value);
    }
  }

}
