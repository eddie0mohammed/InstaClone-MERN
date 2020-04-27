
import React, { Component } from 'react';

import styles from './ResetPassword.module.css';

import {connect } from 'react-redux';
import {Formik} from 'formik';
import * as Yup from 'yup';

import Error from '../../../components/ErrorComponent/ErrorComponent';

import * as authActionCreators from '../../../Redux/Actions/AuthActionCreators';


const validationSchema = Yup.object().shape({
   
    password: Yup.string()
                    .min(8, 'Password is too short - should be 8 chars minimum.')
                    .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])/, 'Password must contain at least one Uppercase letter, one digit and a special character')
                    .required('Password required'),
    confirmPassword: Yup.string()
                    .oneOf([Yup.ref('password'), null], 'Passwords do not match')
                    .required('Confirm Password')
});


class ResetPassword extends Component {

    handleSubmitForm = async (password, confirmPassword) => {
        
        const token = this.props.match.params.token;
        let res;
        if (password === confirmPassword){
            res = await this.props.resetPassword(password, token);

        }
        
        if (res.status === 'success'){
            this.props.history.push('/auth/login');
        }
    }


    render() {
        return (
            <div className={styles.container}>

                <Formik 
                    initialValues = {{
                        password: '',
                        confirmPassword: ''
                    }}
                    validationSchema={validationSchema}

                    onSubmit={ (values, {setSubmitting, resetForm}) => {
                        setSubmitting(true);
                        
                        //form submitted => what actions to take
                        this.handleSubmitForm(values.password, values.confirmPassword);
                        
                        // resetForm();
                        setSubmitting(false);
                    }}
                    >
                {({values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting}) => (

                    <form className={styles.form} onSubmit={handleSubmit}>

                        <h1 className={styles.heading}>Reset Password</h1>

                        <p className={styles.text}>Enter your new password</p>
                        
                        <input className={styles.input} type="password" name='password' placeholder="Password" value={values.password} onChange={handleChange} onBlur={handleBlur}/>
                        <Error touched={touched.password} message={errors.password}/>

                        <input className={styles.input} type="password" name='confirmPassword' placeholder="Confirm Password" value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur}/>
                        <Error touched={touched.confirmPassword} message={errors.confirmPassword}/>

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
        resetPassword: (password, token) => dispatch(authActionCreators.resetPassword(password, token)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);