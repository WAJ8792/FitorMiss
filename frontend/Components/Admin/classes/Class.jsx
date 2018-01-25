import React from 'react';

export default class GymClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.props;
  }

  handleDelete(e) {
    firebase.database().ref("classes/" + this.state.key).remove();
  }

  render() {
    return(
      <div className="class-info">

        <section>
          <div>
            {this.state.name}
          </div>

          <div>
            {this.state.date}
          </div>

          <div>
            {this.state.time}
          </div>

          <div>
            {this.state.duration}
          </div>

          <div>
            {this.state.seats}
            <p style={{margin: 0}}>seats</p>
          </div>

          <div>
            <button onClick={e => this.handleDelete(e)}>Delete Class</button>
          </div>
        </section>
      </div>
    )
  }
}
