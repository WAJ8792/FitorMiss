import React from 'react';

import Amenities from './Amenities';

export default class EditMyGym extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gymName: "",
      neighborhood: "",
      email: "",
      amenities: {
        parking: false,
        showers: false,
        lockers: false,
        towels: false,
        mat_rentals: false,
      },
      user: "",
    }

    this.gymRef = firebase.database().ref("vendor");
    this.fetchUserInfo = this.fetchUserInfo.bind(this);
  }

  fetchUserInfo(user) {
    let gymName, neighborhood, amenities, amenityKey, email

    this.gymRef.orderByKey().equalTo(user).on("value", snap => {
      gymName = snap.val()[user].gym_name;
      neighborhood = snap.val()[user].neighborhood;
      email = snap.val()[user].email;
      this.setState({gymName, neighborhood, email});
    })
    firebase.database().ref('amenities')
    .orderByChild("vendor_id")
    .equalTo(user).on("value", snap => {
      amenityKey = Object.keys(snap.toJSON())[0];
      amenities = snap.val()[amenityKey];
      this.setState({amenities, amenityKey});
    });
  }

  componentDidMount() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    app.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user.uid, loggedOut: false });
        this.fetchUserInfo(user.uid);
      }
    });
  }

  handleChange(e, field) {
    this.setState({[field]: e.target.value});
  }

  handleChoose(e, field) {
    e.preventDefault();
    let amenities = this.state.amenities;
    if (amenities[field] === true) {
      amenities[field] = false;
    } else { amenities[field] = true; }

    this.setState({amenities});
  }

  handleSaveChanges() {
    firebase.database().ref('vendor/' + this.state.user).set({
      gym_name: this.state.gymName,
      neighborhood: this.state.neighborhood,
      email: this.state.email,
    });
    if (this.state.amenityKey) {
      firebase.database().ref('amenities/' + this.state.amenityKey).set(this.state.amenities);
    } else {
      let amenities = this.state.amenities;
      amenities.vendor_id = this.state.user;
      firebase.database().ref('amenities').push().set(amenities);
    }
  }

  render() {
    let loading;
    if (!this.state.gymName) {
      loading = <p style={{color: 'red'}}>Retrieving your information...</p>
    } else { loading = null }

    return(
      <div className="page-container">
        <div className="edit-gym">
          <h1> Edit Gym Info </h1>
          {loading}
          <div
            style={{display: "flex"}}
            >
            <div style={{float: 'left', marginRight: "200px"}}>
              <section>
                <div>
                  <p>Your Gym Name</p>
                  <input
                    onChange={e => this.handleChange(e, 'gymName')}
                    value={this.state.gymName}
                    className="input-text"
                    type="text" />
                </div>
                <div>
                  <p>Your Photo</p>
                  <input value="Not available yet" type="text" className="input-text" readOnly/>
                </div>
              </section>

              <section>
                <div>
                  <p>Displayed Address</p>
                  <input
                    onChange={e => this.handleChange(e, 'neighborhood')}
                    value={this.state.neighborhood}
                    className="input-text"
                    type="text" />
                </div>
              </section>
            </div>

            <section>
              <div>
                <p>MyGym Amenities:</p>
                <Amenities
                amenities={this.state.amenities}
                handleChoose={this.handleChoose.bind(this)}
                />
              </div>
            </section>

          </div>
          <button onClick={e => this.handleSaveChanges()}>Save Changes</button>
        </div>
      </div>
    )
  }
}
