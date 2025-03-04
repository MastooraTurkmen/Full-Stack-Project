import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { Header, Landing } from "./components/index";
import Header from "./components/Header.jsx";
import Landing from "./components/Landing.jsx";
import Dashboard from "./components/Dashboard.jsx";
import SurveyNew from "./components/SurveyNew.jsx";
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
          <Route element={<Dashboard />} path="surveys" />
          <Route element={<SurveyNew />} path="surveys/new" />
        </Routes>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => ({ user: state.auth });

export default connect(mapStateToProps, actions)(App);
