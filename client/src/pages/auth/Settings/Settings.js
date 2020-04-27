
import React, { Component } from 'react';

import styles from './Settings.module.css';

// import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

// import * as authActionCreators from '../../../Redux/Actions/AuthActionCreators';

class Settings extends Component {

    state = {
        username: '',
        email: '',
        dateRegistered: ''
    }

    componentDidMount(){
        if (this.props.user){
            this.setState({
                username: this.props.user.username,
                email: this.props.user.email,
                dateRegistered: this.props.user.dateCreated.split('T')[0]
            });
        }
    }


    componentDidUpdate(prevProps){
        if (prevProps.user !== this.props.user){
            this.setState({
                username: this.props.user.username,
                email: this.props.user.email,
                dateRegistered: this.props.user.dateCreated.split('T')[0]
            });
        }
    }


    render() {
        return (
            <div className={styles.container}>

                <form className={styles.form} onSubmit={this.handleSubmit}>

                    <h1 className={styles.heading}>Settings</h1>

                    <label className={styles.label} htmlFor="username">Username</label>
                    <input className={styles.input} type="text" name='username' placeholder="Username" value={this.state.username} disabled/>
                    <label className={styles.label} htmlFor="email">Email</label>
                    <input className={styles.input} type="email" name='email' placeholder="Email" value={this.state.email} disabled/>
                    <label className={styles.label} htmlFor="dateRegistered">Date Registered</label>
                    <input className={styles.input} type="dateRegistered" name='text' placeholder="Date Registered" value={this.state.dateRegistered} disabled/>

                    {/* <div className={styles.passContainer}>
                        <label className={styles.label1} htmlFor="changePasss">Change Password</label>
                        <Link className={styles.pass} to='/auth/reset-mypassword' >Click here</Link>
                    </div> */}
            

                </form>
                
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);