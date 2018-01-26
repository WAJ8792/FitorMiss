import React from 'react';

export default class ClassesList extends React.Component {
  render() {
    let classes = this.props.classes;
    return(
      <span>
        {classes}
      </span>
    )
  }
}
