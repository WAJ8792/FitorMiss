import React from 'react';

export default class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      address: {
        street: "",
        city: "",
        state: "",
      },
      email: "",
      newData: false,
    }
    this.create = this.create.bind(this);
  }

  componentDidMount() {
    let user = this.props.user.uid;
    this.setState({user});
    if (user != "") {
      this.fetchAccountInfo(user);
    }
  }

  fetchAccountInfo(user) {
    let newAddress;

    firebase.database().ref('address').orderByChild("vendor_id")
      .equalTo(user).on("value", snap => {
        if (snap.val() != null) {
          let addressKey = Object.keys(snap.toJSON())[0];
          let info = snap.val()[addressKey];
          newAddress = {
            user: info.vendor_id,
            street: info.street,
            city: info.city,
            state: info.state,
          }
          this.setState({address: newAddress, addressKey});
        } else { this.setState({newData: true}); }
      });
  }

  handleChange(field) {
    return e => this.setState({[field]: e.target.value});
  }

  edit(e) {
    // takes an address object as in state and send it with user id for validation.
    // takes an email as above, also with a uid.
  }

  create(e) {
    let info = this.state;
    let address = {
      street: info.street, city: info.city, state: info.state, vendor_id: info.user,
    };
    firebase.database().ref('address/').push().set(address);
  }


  render() {
    let submit;
    let address = this.state.address;
    if (this.state.newData) {
      submit = (this.create);
    } else { submit = this.edit; }
    console.log(this.state);

    return(
      <div className="account">
        <h2>Edit Account</h2>
        <section>

          <div>
            <h3>Adress</h3>
            <p>Street Address</p>
            <input type="text"
              onChange={this.handleChange("street")}
              value={address.street}/>
            <p>City</p>
            <input type="text"
              onChange={this.handleChange("city")}
              value={address.city}/>
            <p>State</p>
            <input type="text"
              onChange={this.handleChange("state")}
              value={address.state}/>
          </div>

          <div>
            <h3>Email</h3>
            <p>This is not necessarily the email used for login</p>
            <input type="text" onChange={this.handleChange("email")} />
          </div>

        </section>

        <button onClick={() => submit()} style={{float: 'right'}}>Submit</button>
      </div>
    )
  }
}
