import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';

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
    this.getCurrentUser();
  }

  getCurrentUser() {
    app.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user.uid, loggedOut: false });
        this.fetchUserInfo(user.uid);
        this.getUserType(user.uid);
      }
    });
  }

  getUserType(user) {
    firebase.database().ref('user_type')
    .orderByKey().equalTo(user).on('value', snap => {
        this.setState({type: snap.val()[user]});
      })
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

    if (!this.state.gymName) {
      return (<h1>Loading . . .</h1>)
    } else {

      return (
        <div className="page-container">
          <section className="my-gym">
            <h1> Hello {this.state.gymName}! </h1>
            <h3>Here is some useful info...</h3>
            <ul>
              <li>Your gym is located at: {this.state.neighborhood}</li>
            </ul>
          </section>
        </div>
      )
    }
  }
}

const mapStateToProps = ( state ) => {
  return {
    user: state.sessions.user,

  }
}

export default withRouter(connect(
  mapStateToProps, null
)(MyGym));