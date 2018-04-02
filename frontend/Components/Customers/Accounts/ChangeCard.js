import React from 'react';

export default class ChangeCard extends React.Component {
  render() {
    const props = this.props;
    return(
      <form onSubmit={e => props.changeCard(e)}>
        <select
          value={props.stripe_id}
          onChange={props.selectCard}
          style={{WebkitAppearance: 'menulist-button', width: '138px'}}>
          {Object.keys(props.cards).map(stripe_id => {
            if (stripe_id === props.stripe_id) {
              return <option
                value={stripe_id}
                selected>
                Card ending in {props.cards[stripe_id]}
              </option>
            } else {
              return <option
                value={stripe_id}>
                Card ending in {props.cards[stripe_id]}
              </option>
            }
          }
          )}
        </select>
        {props.changeCardButton}
      </form>
    )
  }
}
