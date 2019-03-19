import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import './styles.scss';

export default class Select extends React.Component {
  static defaultProps = {
    selectedIndex: 0,
    options: [],
    onChange: () => {},
  }

  state = {
    isActive: false,
    selectedIndex: 0,
  };

  componentWillMount () {
    this.componentWillReceiveProps(this.props);
  }
  componentWillReceiveProps (props) {
    this.setState({ selectedIndex: props.selectedIndex });
  }

  render() {
    return <div className={classnames('select', { active: this.isActive })}>
      <div className='selected option-wrapper' onClick={() => this.isActive = !this.isActive}>
        {this.props.options[this.state.selectedIndex]}
        <i className='icon icon-arrow-down' />
        <i className='icon icon-arrow-up' />
      </div>
      <div className='option-menu'>
        {_.map(this.props.options, (option, index) =>
          <div
            key={`option-wrapper_${index}`}
            className={classnames('option-wrapper', { selected: index === this.state.selectedIndex})}
            onClick={() => this.onOptionClick(index) }
          >
            <option.type key={`option_${index}`} {...option.props} />
          </div>
        )}
      </div>
    </div>;
  }

  onOptionClick (index) {
    this.setState({ selectedIndex: index, isActive: false });
  }

  onChange () {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(this.props.options[this.state.selectedIndex].value);
    }
  }

}