
import React, { Component } from 'react';

import styles from './Register.module.css';

import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Formik} from 'formik';
import * as Yup from 'yup';

import Error from '../../../components/ErrorComponent/ErrorComponent';

import * as authActionCreators from '../../../Redux/Actions/AuthActionCreators';


const validationSchema = Yup.object().shape({
    username: Yup.string()
                    .min(3, 'Username is too short - should be 3 chars minimum.')
                    .required('Username is required'),
    email: Yup.string()
                    .email('Must be a valid email address')
                    .required('Email required'),
    password: Yup.string()
                    .min(8, 'Password is too short - should be 8 chars minimum.')
                    .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])/, 'Password must contain at least one Uppercase letter, one digit and a special character')
                    .required('Password required')
});


class Register extends Component {

    handleSubmitForm = async (username, email, password) => {
        // console.log(this.state);
        const res = await this.props.register(username, email, password);

        if (res.status === 'success'){
            this.props.history.push('/auth/confirm-account');
        }
    }


    render() {
        return (
            <div className={styles.container}>

                <Formik 
                    initialValues = {{
                        username: '',
                        email: '',
                        password: ''
                    }}
                    validationSchema={validationSchema}

                    onSubmit={ (values, {setSubmitting, resetForm}) => {
                        setSubmitting(true);
                        
                        //form submitted => what actions to take
                        this.handleSubmitForm(values.username, values.email, values.password)
                        
    
                        // resetForm();
                        setSubmitting(false);
                    }}
                >
                {({values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting}) => (

                    <form className={styles.form} onSubmit={handleSubmit}>

                        <h1 className={styles.heading}>Register</h1>

                        <input className={styles.input} type="text" name='username' placeholder="Username" value={values.username} onChange={handleChange} onBlur={handleBlur}/>
                        <Error touched={touched.username} message={errors.username}/>

                        <input className={styles.input} type="email" name='email' placeholder="Email" value={values.email} onChange={handleChange} onBlur={handleBlur}/>
                        <Error touched={touched.email} message={errors.email}/>
                        
                        <input className={styles.input} type="password" name='password' placeholder="Password" value={values.password} onChange={handleChange} onBlur={handleBlur}/>
                        <Error touched={touched.password} message={errors.password}/>

                        
                        <p style={{color: 'red'}}>{this.props.error}</p>

                        <input className={styles.submit} type="submit" value='Submit' disabled={isSubmitting}/>
                        
                        <Link to="/auth/login" className={styles.link}> Already have an account? Login</Link>

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
        register: (username, email, password) => dispatch(authActionCreators.register(username, email, password)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)