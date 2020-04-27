import React from 'react';
import './App.css';

import {Switch, Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

import Header from './components/Header/Header';

import Home from './pages/Home/Home';
import Register from './pages/auth/Register/Register';
import Login from './pages/auth/Login/Login';
import ConfirmRegister from './pages/auth/ConfirmRegister/ConfirmRegister';
import ForgotPassword from './pages/auth/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword/ResetPassword';
import ResetMyPassword from './pages/auth/ResetMyPassword/ResetMyPassword';
import Settings from './pages/auth/Settings/Settings';
import ChangeProfilePicture from './pages/auth/ChangeProfilePicture/ChangeProfilePicture';

import New from './pages/post/New/New';
import View from './pages/post/View/View';
import Edit from './pages/post/Edit/Edit';
import MyPosts from './pages/post/MyPosts/MyPosts';

import * as authActionCreators from './Redux/Actions/AuthActionCreators';
import * as postActionCreators from './Redux/Actions/PostActionCreators';

class App extends React.Component {

  async componentDidMount(){
    const res = await this.props.getUser();
    if (res.status === 'fail'){
      localStorage.removeItem('token');
    }
    await this.props.getAllPosts();

  }

  async componentDidUpdate(prevProps){
    if (prevProps.posts.length !== this.props.posts.length){
        await this.props.getAllPosts();
    }

  }
  

  render(){
    
    return (
      <div className="App">

        <Header />

        <Switch>

          <Route path='/' exact component={Home} />
          <Route path='/auth/register' exact component={Register} />
          <Route path='/auth/login' exact component={Login} />
          <Route path='/auth/confirm-account' exact render={(props) => <ConfirmRegister {...props} action="activate"/>} />
          <Route path='/auth/confirm-resetpassword' exact render={(props) => <ConfirmRegister {...props} action="reset"/>} />
          <Route path='/auth/forgot-password' exact component={ForgotPassword} />
          <Route path='/auth/reset-password/:token' exact component={ResetPassword} />
          <Route path='/auth/reset-mypassword' exact component={ResetMyPassword} />
          <Route path='/auth/settings' exact component={Settings} />
          <Route path='/auth/change-profilePicture' exact component={ChangeProfilePicture} />

          <Route path='/post/new' exact component={New} />
          <Route path='/post/:postId' exact render={(props) => this.props.isAuthenticated ? <View {...props}/> : <Redirect to='/auth/login' />} />
          <Route path='/post/edit/:postId' exact render={(props) => this.props.isAuthenticated ? <Edit {...props}/> : <Redirect to='/auth/login' />} />
          <Route path="/auth/myImages" exact render={(props) => this.props.isAuthenticated ? <MyPosts {...props}/> : <Redirect to='/auth/login' />} />
          
          <Route component={Home} />
        </Switch>

        
      </div>
    
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    posts: state.post.posts
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUser: () => dispatch(authActionCreators.getUser()),
    getAllPosts: () => dispatch(postActionCreators.getAllPosts()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
