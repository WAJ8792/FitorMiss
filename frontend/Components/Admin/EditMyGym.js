import React from 'react';

export default class EditMyGym extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gymName: "",
      neighborhood: "",
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
    let newState = this.state;
    let gymName, neighborhood, amenities, amenityKey

    this.gymRef.orderByKey().equalTo(user).on("value", snap => {
      gymName = snap.val()[user].gym_name;
      neighborhood = snap.val()[user].neighborhood;
      this.setState({gymName, neighborhood});
    })
    firebase.database().ref('amenities')
    .orderByChild("vendor_id")
    .equalTo(user).on("value", snap => {
      amenityKey = Object.keys(snap.toJSON())[0];
      amenities = snap.val()[amenityKey];
      console.log(snap.val());
      this.setState({amenities, amenityKey});
    });
  }

  componentDidMount() {
    let user = this.props.user.uid;
    this.setState({user});
    if (user != "") {
      this.fetchUserInfo(user);
    }
  }

  handleChange(e, field) {
    this.setState({[field]: e.target.value});
  }

  handleChoose(field) {
    let amenities = this.state.amenities;
    amenities[field] = (amenities[field]) ? false : true
    return e => this.setState({amenities});
  }

  handleSaveChanges() {
    firebase.database().ref('vendor/' + this.state.uid).set({
      gym_name: this.state.gymName,
      neighborhood: this.state.neighborhood,
    });
    if (this.state.amenityKey) {
      firebase.database().ref('amenities/' + this.state.amenityKey).set(this.state.amenities);
    } else {
      let amenities = this.state.amenities;
      amenities.vendor_id = this.state.uid;
      firebase.database().ref('amenities').push().set(amenities);
    }
  }

  getField(amenity) {
    switch (amenity) {
      case "Parking":
        return "parking";
      case "Mat Rentals":
        return "mat_rentals";
      case "Showers":
        return "shower";
      case "Lockers":
        return "lockers";
      case "Towels":
        return "towels";
    }
  }

  render() {
    let amenities = [
      "Parking",
      "Mat Rentals",
      "Showers",
      "Lockers",
      "Towels",
    ]

    let amenityOptions = [];

    amenities.forEach( amenity => {
      let field = this.getField(amenity)

        if ((!this.state.amenities === undefined) && this.state.amenities[field]) {
          amenityOptions.push(<section key={field}>
              <input
                onClick={() => this.handleChoose(field)}
                type="checkbox"
                className="checkbox-input"
                checked/>
              <label>{amenity}</label>
            </section>
          )
        } else {
          amenityOptions.push(<section key={field}>
              <input
                onClick={() => this.handleChoose(field)}
                className="checkbox-input"
                type="checkbox" />
              <label>{amenity}</label>
            </section>
          )
        }
    })
    return(
      <section className="my-gym">
        <div className="edit-gym">
          <h1> Edit Gym Info </h1>

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

          <section>
            <div>
              <p>MyGym Amenities:</p>
              {amenityOptions}
            </div>
          </section>

          <button onClick={e => this.handleSaveChanges()}>Save Changes</button>
        </div>
      </section>
    )
  }
}
