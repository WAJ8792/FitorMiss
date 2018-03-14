import React from 'react';

export default class DeleteClass extends React.Component {
  render() {
    return (
      <div className="add-class">
        <div className="add-class-modal">
          <section>
            Are you sure you want to delete this class?
            All reservations will be canceled.
            <button onClick={this.props.delete}>DELETE</button>
          </section>
        </div>
      </div>
    )
  }
}
