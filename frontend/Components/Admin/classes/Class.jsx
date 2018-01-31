import React from 'react';

export default class GymClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.props.props;
    this.handleChange = this.handleChange.bind(this);
  }

  handleDelete(e) {
    firebase.database().ref("classes/" + this.state.class_id).remove();
  }

  handleChange(e, field) {
    this.setState({[field]: e.target.value});
  }

  readWriteClass(e, field) {
    e.preventDefault();

    this.setState({type: field});
  }

  render() {
    if (this.state.type === "write") {
      return(
        <div className="class-info">

          <section>
            <div>
              <p>Class Title</p>
              <input
                type="text"
                onChange={e => this.handleChange(e, 'name')}
                value={this.state.name}/>
            </div>

            <div>
              <p>Day</p>
              <input
                type="day"
                onChange={e => this.handleChange(e, 'day')}
                value={this.state.day}/>
            </div>

            <div>
              <p>Time</p>
              <input
                type="time"
                onChange={e => this.handleChange(e, 'time')}
                value={this.state.time}/>
            </div>

            <div>
              <p>Duration</p>
              <input
                type="number"
                onChange={e => this.handleChange(e, 'duration')}
                value={this.state.duration}/>
            </div>

            <div>
              <p>Total Seats</p>
              <input
                type="number"
                onChange={e => this.handleChange(e, 'seats')}
                value={this.state.seats}/>
            </div>

            <div>
              <button onClick={e => this.readWriteClass(e, 'read')}>Cancel Changes</button>
            </div>
            <div>
              <button onClick={e => this.props.saveChanges(e, this.state)}>Save</button>
            </div>
          </section>

        </div>
      )
    }
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
          <div>
            <button onClick={e => this.readWriteClass(e, 'write')}>Edit Class</button>
          </div>
        </section>
      </div>
    )
  }
}
