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
            <h1> Hello {this.state.gymName}! </h1>
            <div style={{textAlign: 'center'}}>
              <img src={window.images.profile} />
            </div>

           <section>
            <Note
              title="Summary"
              stat="6"
              note="Weekly classes" />

            <Note
              title="Users"
              stat="14"
              note="Users  are registered for a class this week" />
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
        <div>
          <h4>{this.props.title}</h4>
        </div>
        <div>
          <h2>{this.props.stat}</h2>
          <p>{this.props.note}</p>
        </div>
      </div>
    )
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
