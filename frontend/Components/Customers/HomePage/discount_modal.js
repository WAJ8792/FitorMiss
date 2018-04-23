import React from 'react';

import { findAvailableDiscount } from '../../../util/discounts_util';

export default class ApplyDiscount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: false,
      code: ""
    }
  }

  handleChange(e) {
    this.setState({code: e.target.value});
  }

  checkCode(e) {
    e.preventDefault();
    const uid = this.props.uid;
    const code = this.state.code;
    this.props.discountIds.forEach(id => {
      firebase.database().ref(`discounts/${id}/${uid}`).set(code)
      .then(success => {
        findAvailableDiscount(
          firebase.database(),
          id,
          this.props.confirmDiscount
        )
      });
    });
  }

  render() {
    let content;
    if (this.state.value === false) {
      content = <div className="discount-content">
        <span>Enter discount code.</span>
        <form onSubmit={e => this.checkCode(e)}>
          <input
            type="password"
            onChange={e => this.handleChange(e)} />
          <input
            type="submit"
            value="Apply Code" />
        </form>
      </div>
    } else {
      content = <div className="discount-content">
        <span>You are already using a discount.</span>
      </div>
    }
    return(
      <div className="add-class">
        <div className="reservation-modal">

          {content}

          <div className="class-buttons">
            <button onClick={e => this.props.closeModal() }
              className="class-cancel-button">
              Close
            </button>
          </div>

        </div>
      </div>
    )
  }
}
