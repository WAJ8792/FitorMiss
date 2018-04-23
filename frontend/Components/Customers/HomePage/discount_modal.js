import React from 'react';

export default class ApplyDiscount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'loading',
      discountIds: [],
      code: ""
    }
  }

  componentDidMount() {
    firebase.database().ref('discounts/discount_list').on('value', snap => {
      if (snap.val()) {
        this.setState({discountIds: Object.keys(snap.val())});
        Object.keys(snap.val()).forEach( id => {
          this.findAvailableDiscount(id);
        })
      }
      if (this.state.value === 'loading') {
        this.setState({value: false});
      }
    });
  }

  findAvailableDiscount(id) {
    firebase.database().ref('discounts/' + id + '/value').on('value', snap => {
      if (snap.val()) { this.setState({value: snap.val()}); }
    })
  }

  handleChange(e) {
    this.setState({code: e.target.value});
  }

  checkCode(e) {
    e.preventDefault();
    const uid = this.props.uid;
    const code = this.state.code;
    this.state.discountIds.forEach(id => {
      firebase.database().ref(`discounts/${id}/${uid}`).set(code)
      .then(success => console.log(success));
    });
  }



  render() {
    let content;
    if (this.state.value === 'loading') {
      content = <div className="discount-content">
        <span>Checking for your discounts</span>
      </div>
    } else if (this.state.value === false) {
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
