
import React, { Component } from 'react';

import styles from './ConfirmRegister.module.css';

import {Link} from 'react-router-dom';

class ConfirmRegister extends Component {
    render() {

        let data = {
            activate: {
                heading: 'Activate Account',
                message: 'A activation link has been sent to your email. Please use the link to activate your account'
            },

            resetPassword: {
                heading: 'Reset Password',
                message: 'A password reset link has been sent to your email. Please use the link to reset your password'
            }
            
        }

        let outcome = data.activate;
        if (this.props.action === 'reset'){
            outcome = data.resetPassword
        }

        return (
            <div className={styles.container}>

                <div className={styles.form}>

                    <h1 className={styles.heading}>{outcome.heading}</h1>

                    <p className={styles.text}>{outcome.message}</p>

                    <Link to='/auth/login' className={styles.btn}>Login</Link>

                </div>
                
            </div>
        )
    }
}

export default ConfirmRegister;