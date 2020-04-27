
import React, { Component } from 'react';

import styles from './Login.module.css';

import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Formik} from 'formik';
import * as Yup from 'yup';

import Error from '../../../components/ErrorComponent/ErrorComponent';
import * as authActionCreators from '../../../Redux/Actions/AuthActionCreators';



const validationSchema = Yup.object().shape({
    email: Yup.string()
                    .email('Must be a valid email address')
                    .required('Email required'),
    password: Yup.string()
                    // .min(8, 'Password is too short - should be 8 chars minimum.')
                    // .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.')
                    .required('Password required')
});


class Login extends Component {

    handleSubmitForm = async (email, password) => {

        const res = await this.props.login(email, password);
        
        if (res.status === 'success'){
            this.props.history.push('/');
        }
    }


    render() {
        return (
            <div className={styles.container}>

                <Formik 
                    initialValues = {{
                        email: '',
                        password: ''
                    }}

                    validationSchema={validationSchema}

                    onSubmit={ (values, {setSubmitting, resetForm}) => {
                        setSubmitting(true);
                        
                        //form submitted => what actions to take
                        this.handleSubmitForm(values.email, values.password)
    
                        // resetForm();
                        setSubmitting(false);
                    }}

                >
                    {({values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting}) => (
                        
                         <form className={styles.form} onSubmit={handleSubmit}>

                            <h1 className={styles.heading}>Login</h1>

                            <input className={`${styles.input} ${touched.email && errors.email ? `${styles.error}` : '' }`} type="email" name='email' placeholder="Email" value={values.email} onChange={handleChange} onBlur={handleBlur}/>
                            <Error touched={touched.email} message={errors.email}/>

                            <input className={`${styles.input} ${touched.password && errors.password ? `${styles.error}` : '' }`} type="password" name='password' placeholder="Password" value={values.password} onChange={handleChange} onBlur={handleBlur} />
                            <Error touched={touched.password} message={errors.password}/>

                            <p style={{color: 'red'}}>{this.props.error}</p>

                            <input className={styles.submit} type="submit" value='Submit' disabled={isSubmitting}/>
                            
                            <Link to='/auth/forgot-password' className={styles.link}> Forgot your password?</Link>

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
        login: (email, password) => dispatch(authActionCreators.login(email, password))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);