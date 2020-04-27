
import React, { Component } from 'react';

import styles from './ForgotPassword.module.css';

import {connect} from 'react-redux';
import {Formik} from 'formik';
import * as Yup from 'yup';

import Error from '../../../components/ErrorComponent/ErrorComponent';

import * as authActionCreators from '../../../Redux/Actions/AuthActionCreators';


const validationSchema = Yup.object().shape({
   
    email: Yup.string()
                    .email('Must be a valid email address')
                    .required('Email required')
});


class ForgotPassword extends Component {

    // state = {
    //     email: ''
    // }

    // inputChangeHandler = (e) => {
    //     this.setState({
    //         [e.target.name]: e.target.value
    //     });
    // }

    handleSubmitForm = async (email) => {

        const res = await this.props.askResetPassword(email);
        if (res.status === 'success'){
            this.props.history.push('/auth/confirm-resetpassword');
        }

    }

    // checkSubmit = () => {
    //     let disable = true;
    //     if (this.state.email){
    //         disable = false;
    //     }
    //     return disable;
    // }

    render() {
        return (
            <div className={styles.container}>

                {/* <form className={styles.form} onSubmit={this.handleSubmit}>

                    <h1 className={styles.heading}>Forgot Password</h1>

                    <p className={styles.text}>Please enter your email. A password reset link will be sent to your email</p>
                    <input className={styles.input} type="email" name='email' placeholder="Email" value={this.state.email} onChange={this.inputChangeHandler} />
                   
                    <p style={{color: 'red'}}>{this.props.error}</p>
                    <input className={styles.submit} type="submit" value='Submit' disabled={this.checkSubmit()}/>

                </form> */}

                <Formik 
                    initialValues = {{
                        email: ''
                    }}
                    validationSchema={validationSchema}

                    onSubmit={ (values, {setSubmitting, resetForm}) => {
                        setSubmitting(true);
                        
                        //form submitted => what actions to take
                        this.handleSubmitForm(values.email)
    
                        // resetForm();
                        setSubmitting(false);
                    }}
                > 
                {({values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting}) => (

                    <form className={styles.form} onSubmit={handleSubmit}>

                        <h1 className={styles.heading}>Forgot Password</h1>

                        <p className={styles.text}>Please enter your email. A password reset link will be sent to your email</p>
                        <input className={styles.input} type="email" name='email' placeholder="Email" value={values.email} onChange={handleChange} onBlur={handleBlur} />
                        <Error touched={touched.email} message={errors.email}/>
                    
                        <p style={{color: 'red'}}>{this.props.error}</p>
                        <input className={styles.submit} type="submit" value='Submit' disabled={isSubmitting}/>

                    </form>
                    
                )}

                </Formik>
                
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        error: state.error.error
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        askResetPassword: (email) => dispatch(authActionCreators.askResetPassword(email)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)