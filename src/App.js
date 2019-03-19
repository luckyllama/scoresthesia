import React, { Component } from 'react';
import { HashRouter as Router, Route, withRouter } from 'react-router-dom';
import Layout from 'layouts/default';
import Home from 'routes/home';
import Generate from 'routes/generate';
import About from 'routes/about';

class App extends Component {
  render() {
    return (
      <Router>
        <Layout>
          <Route exact path='/' component={Home} />
          <Route path='/generate' component={Generate} />
          <Route path='/about' component={About} />
          <ScrollToTop />
        </Layout>
      </Router>
    );
  }
}

export default App;

class ScrollToTopBase extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
      document.getElementById('page-content').scrollTo(0,0);
    }
  }

  render() {
    return null;
  }
}

let ScrollToTop = withRouter(ScrollToTopBase);