import React, { Component } from "react";
import StripCheckout from "react-stripe-checkout";
import * as actions from "../actions";
import { connect } from "react-redux";

class Payments extends Component {
  render() {
    return (
      <StripCheckout
        name="Emaily"
        description="$5 for 5 email credits"
        amount={500}
        token={(token) => this.props.handleToken(token)}
        stripeKey={import.meta.env.VITE_PUBLISHABLE_KEY}
      >
        <button className="btn">Add Credits</button>
      </StripCheckout>
    );
  }
}

export default connect(null, actions)(Payments);
