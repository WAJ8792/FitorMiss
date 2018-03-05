import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';

class MyGym extends React.Component {
  constructor(props) {
    super(props);
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
        <div id="page-background">
        <div className="page-container">
          <section className="my-gym">

          <section>
            <Note
              title="Users"
              stat="140"
              note="Users  are registered for a class this month!" />
            </section>
          </section>
        </div>
        </div>
      )
    }
  }
}

class Note extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="note">
        <div className="note-header">
          {this.props.title}
        </div>
        <div className="note-text">
          <p>{this.props.stat} </p>
          {this.props.note}
        </div>
      </div>
    );
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
