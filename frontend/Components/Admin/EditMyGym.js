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
      }
    }
    this.user_id = "4";

    this.gymRef = firebase.database().ref("vendor");
  }


  componentWillMount() {
    this.gymRef.orderByKey().equalTo(this.user_id).on("value", snap => {
      let newState = this.state;
      newState.gymName = snap.val()[this.user_id].gym_name;
      newState.neighborhood = snap.val()[this.user_id].neighborhood;
      this.setState({newState});
    })
    firebase.database().ref('amenities')
    .orderByChild("vendor_id")
    .equalTo(this.user_id).on("value", snap => {
      let newState = this.state;
      newState.amenities = snap.val()[1];
      this.state.amenityKey = Object.keys(snap.toJSON())[0];
      this.setState({newState});
    });
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
    firebase.database().ref('vendor/' + this.user_id).set({
      gym_name: this.state.gymName,
      neighborhood: this.state.neighborhood,
    });
    firebase.database().ref('amenities/' + this.state.amenityKey).set(this.state.amenities);
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
    console.log(this.props);
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

        if (this.state.amenities[field]) {
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
