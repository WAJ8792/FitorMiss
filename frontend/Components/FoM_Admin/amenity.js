import React from 'react';

export default class Amenity extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const amenity = this.props.amenity
    let style = "unchecked";

    if (this.props.checked === true) {
      style = "checked";
    }

    return (
      <div style={{display: 'flex'}}
        onClick={e => this.props.handleChoose(e, amenity)}>

        <p className={style}> </p>
        <p>{this.props.amenityPrinted}</p>
      </div>
    )
  }
}
