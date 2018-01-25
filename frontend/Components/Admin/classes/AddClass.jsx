import React from 'react';

export default class AddClass extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
      date: "",
      time: "",
      duration: "",
      seats: ""
    }
    this.vendor_id = "4";
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e, field) {
    this.setState({[field]: e.target.value});
  }

  handleAdd() {
    let newClass = this.state;
    this.state.vendor_id = this.vendor_id;
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
        <section>
          <div>
            <p>Class Title</p>
            <input
              type="text"
              onChange={e => this.handleChange(e, 'name')}
              value={this.state.name}/>
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
