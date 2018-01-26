import React from 'react';

export default class AddClass extends React.Component {
  constructor() {
    super();
    this.state = {
      vendor_id: "",
      name: "",
      date: "",
      time: "",
      duration: "",
      seats: ""
    }
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    let vendor_id = this.props.user;
    this.setState({vendor_id});
  }

  handleChange(e, field) {
    this.setState({[field]: e.target.value});
  }

  handleAdd() {
    this.props.handleAdd(this.state);
    this.setState({
      name: "",
      date: "",
      time: "",
      duration: "",
      seats: ""
    });
  }

  render() {
    return(
      <div className="add-class">
        <section style={{backgroundColor: "#f2f2f2"}}>
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
            <p>Date</p>
            <input
              type="date"
              onChange={e => this.handleChange(e, 'date')}
              value={this.state.date}/>
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
        </section>
        <button onClick={e => this.handleAdd(e)}>Add Class</button>
      </div>
    )
  }
}
