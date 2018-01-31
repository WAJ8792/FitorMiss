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
      addressKey: false,
      email: "",
    }
    this.createAddress = this.createAddress.bind(this);
    this.editAddress = this.editAddress.bind(this);
    this.editUserInfo = this.editUserInfo.bind(this);
  }

  componentDidMount() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    app.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user.uid, loggedOut: false });
        this.fetchAccountInfo(user.uid);
      }
    });
  }

  fetchAccountInfo(user) {
    let newAddress;

    firebase.database().ref('address').orderByChild("vendor_id")
      .equalTo(user).on("value", snap => {
        if (snap.val() != null) {
          let addressKey = Object.keys(snap.toJSON())[0];
          let info = snap.val()[addressKey];
          newAddress = {
            vendor_id: info.vendor_id,
            street: info.street,
            city: info.city,
            state: info.state,
          }
          this.setState({address: newAddress, addressKey});
        }
      });
  }

  handleChange(field) {
    return e => this.setState({[field]: e.target.value});
  }

  handleAddressChange(e, field) {
    e.preventDefault();

    let address = this.state.address;
    address[field] = e.target.value;
    this.setState({address});
  }

  editAddress() {
    firebase.database().ref('address/' + this.state.addressKey)
      .set(this.state.address);
  }

  createAddress() {
    let info = this.state.address;
    let address = {
      street: info.street, city: info.city, state: info.state, vendor_id: this.state.user,
    };
    firebase.database().ref('address/').push().set(address);
  }

  editUserInfo() {
    firebase.database().ref('vendor/' + this.state.user + "/email")
      .set(this.state.email);
  }

  render() {
    let address = this.state.address;
    let submitAddress = (this.state.addressKey) ? this.editAddress : this.createAddress
    let loading;

    if (this.state.user === "") {
      loading = <p style={{color: 'red'}}>Retrieving your accounnt info...</p>
    } else { loading = null }

    return(
      <div className="account">
        <h2>Edit Account</h2>
        {loading}
        <section>

          <div>
            <h3>Adress</h3>
            <p>Street Address</p>
            <input type="text"
              onChange={e => this.handleAddressChange(e, "street")}
              value={address.street}/>
            <p>City</p>
            <input type="text"
              onChange={e => this.handleAddressChange(e, "city")}
              value={address.city}/>
            <p>State</p>
            <input type="text"
              onChange={e => this.handleAddressChange(e, "state")}
              value={address.state}/>

              <button onClick={() => submitAddress()} style={{float: 'right'}}>Submit</button>
          </div>

          <div>
            <h3>Email</h3>
            <p>This is not necessarily the email used for login</p>
            <input type="text" onChange={this.handleChange("email")} />

            <button onClick={() => this.editUserInfo()} style={{float: 'right'}}>Submit</button>
          </div>

        </section>

      </div>
    )
  }
}
