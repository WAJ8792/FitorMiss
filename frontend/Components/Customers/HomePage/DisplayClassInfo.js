import React from 'react';

import { getTime } from '../../../util/classes_util';

export default class DisplayClassInfo extends React.Component {
  render() {
    let thisClass = this.props.thisClass;
    let time = getTime(thisClass.time);
    return (
      <section className="class-info">
        <div>
          <h5 style={{color: '#1ed0b1'}}>{time}</h5>
          <p></p>
        </div>

        <div>
          <h5 style={{color: '#1ed0b1'}}>{thisClass.vendor}</h5>
          <p>Class description</p>
        </div>

        <div>
          <h5>{thisClass.neighborhood}</h5>
        </div>

        <div>
          <h5>{thisClass.name}</h5>
        </div>

        <div>
          <button onClick={() => this.props.handleReserve(thisClass)}>
            RESERVE CLASS
          </button>
        </div>
      </section>
    )
  }
}
