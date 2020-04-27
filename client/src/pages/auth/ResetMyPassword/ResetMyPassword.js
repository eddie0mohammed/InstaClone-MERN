
import React, { Component } from 'react';

import styles from './ResetMyPassword.module.css';

import {connect } from 'react-redux';
import {Formik} from 'formik';
import * as Yup from 'yup';

import Error from '../../../components/ErrorComponent/ErrorComponent';

import * as authActionCreators from '../../../Redux/Actions/AuthActionCreators';


const validationSchema = Yup.object().shape({
    currentPassword: Yup.string()
                    .min(8, 'Password is too short - should be 8 chars minimum.')
                    .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])/, 'Password must contain at least one Uppercase letter, one digit and a special character')
                    .required('Password required'),
    password: Yup.string()
                    .min(8, 'Password is too short - should be 8 chars minimum.')
                    .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])/, 'Password must contain at least one Uppercase letter, one digit and a special character')
                    .required('Password required'),
    confirmPassword: Yup.string()
                    .oneOf([Yup.ref('password'), null], 'Passwords do not match')
                    .required('Confirm Password')
});


class ResetMyPassword extends Component {


    handleSubmitForm = async (currentPassword, newPassword, confirmPassword) => {
        
        // console.log(this.state);
        if (currentPassword && newPassword === confirmPassword){
            const res = await this.props.changeMyPassword(currentPassword, newPassword);
            
            if (res.status === 'success'){
                this.props.history.push('/');
            }
        }        
    }


    render() {
        return (
            <div className={styles.container}>


                <Formik 
                    initialValues = {{
                        currentPassword: '',
                        password: '',
                        confirmPassword: ''
                    }}
                    validationSchema={validationSchema}

                    onSubmit={ (values, {setSubmitting, resetForm}) => {
                        setSubmitting(true);
                        
                        //form submitted => what actions to take
                        this.handleSubmitForm(values.currentPassword, values.password, values.confirmPassword);
                        
                        setSubmitting(false);
                    }}
                >
                    {({values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting}) => (
                        
                        <form className={styles.form} onSubmit={handleSubmit}>

                            <h1 className={styles.heading}>Reset My Password</h1>

                            
                            <input className={styles.input} type="password" name='currentPassword' placeholder="Current Password" value={values.currentpassword} onChange={handleChange} onBlur={handleBlur}/>
                            <Error touched={touched.currentPassword} message={errors.currentPassword}/>

                            <input className={styles.input} type="password" name='password' placeholder="New Password" value={values.password} onChange={handleChange} onBlur={handleBlur}/>
                            <Error touched={touched.password} message={errors.password}/>

                            <input className={styles.input} type="password" name='confirmPassword' placeholder="Confirm New Password" value={values.confirmPassword} onChange={handleChange} onBlur={handleBlur}/>
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
        changeMyPassword: (currentPassword, newPassword) => dispatch(authActionCreators.changeMyPassword(currentPassword, newPassword)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetMyPassword);