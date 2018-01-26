import React from 'react';
import { connect } from 'react-redux';

import firebaseui from 'firebaseui';

class MyGym extends React.Component {
  constructor(props) {
    super(props);
    // Ideally this can be a presentional component that pulls from props
    // for all info. For this to happen, all info needed for the page will
    // have to be pulled from db with an action and returned as props.
    this.state = {
      user: "",
      amenities: [],
    }
  }

  componentDidMount() {
    let user = this.props.user.uid;
    this.setState({user});
    if (user != "") {
      this.fetchUserInfo(user);
    }
  }

  fetchUserInfo(user) {
    let gymName, neighborhood, amenities, amenityKey

    firebase.database().ref("vendor").orderByKey().equalTo(user).on("value", snap => {
      gymName = snap.val()[user].gym_name;
      neighborhood = snap.val()[user].neighborhood;
      this.setState({gymName, neighborhood});
    })
  }

  render() {
    if (this.state.user === "" ) {
      return (<h1>Loading . . .</h1>)
    } else {

      return (
        <section className="my-gym">
        <div>
          <h1> Hello {this.state.gymName}! </h1>
          <h3>Here is some userful info...</h3>
          <ul>
            <li>Your gym is located at: {this.state.neighborhood}</li>
          </ul>
        </div>
        </section>
      )
    }
  }
}

const mapStateToProps = ( state ) => ({
  user: state.sessions.user
})

export default connect(
  mapStateToProps, null
)(MyGym);
