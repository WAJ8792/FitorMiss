import React from 'react';

export class TypeFilter extends React.Component {

  getTypeFilters() {
    let listItems = [];
    let types = this.props.filters.workoutType;
    Object.keys(types).forEach( type => {
      if (types[type] === true) {
        listItems.push(
          <li
            style={{color: '#f374f3'}}
            onClick={() => this.changeFilter(type)}>
            {type}
          </li>
          )
      } else {
        listItems.push(<li
          onClick={() => this.changeFilter(type)}
          >{type}</li>)
      }
    })
    return listItems
  }

  changeFilter(type) {
    this.props.toggleType(type);
  }

  // printedItem(type) {
  //   switch (type) {
  //     case "cardio":
  //       return "Cardio";
  //     case "boxing":
  //       return "Boxing";
  //     case "rowing":
  //       return "Rowing";
  //     case "yoga":
  //       return "Yoga";
  //     case "pilates":
  //       return 'Pilates';
  //   }
  // }

  render() {
    let listItems = this.getTypeFilters();
    return(
      <div id="side-link">
      <li>
        <h3 onClick={e => this.props.dropDown(e, 'list1')}>Workout Type</h3>
        <ul className={this.props.state.list1}>
          {listItems}
        </ul>
      </li>
    </div>
    )
  }
}
