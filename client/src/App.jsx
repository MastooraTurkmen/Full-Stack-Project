import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header, Landing, Survey, SurveyNew } from "./components/index";
import { Component } from "react";
import * as actions from "./actions";
import { connect } from "react-redux";

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
    console.log(this.props.fetchUser());
  }

  render() {
    return (
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<Landing />} path="landing" />
          <Route element={<Survey />} path="surveys" />
          <Route element={<SurveyNew />} path="surveys/new" />
        </Routes>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => ({ user: state.auth });

export default connect(mapStateToProps, actions)(App);
