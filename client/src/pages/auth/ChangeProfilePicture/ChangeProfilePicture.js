
import React, { Component } from 'react';

import styles from './ChangeProfilePicture.module.css';

import {connect } from 'react-redux';

import * as authActionCreators from '../../../Redux/Actions/AuthActionCreators';

class ChangeProfilePicture extends Component {

    state = {
        selectedFile: null
    }

    handleSelectedFile = (e) => {
        this.setState({
            selectedFile: e.target.files[0]
        });
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        // console.log(this.state);
        const res = await this.props.changeProfilePicture(this.state.selectedFile);
        // console.log(res);
        if (!this.props.error && res.status === 'success'){
            this.props.history.push('/');

        }
    }

    checkSubmitBtn = () => {
        let check = true;
        if (this.state.selectedFile){
            check = false;
        }
        return check;
    }



    render() {
        return (
            <div className={styles.container}>

                <form className={styles.form} onSubmit={this.handleSubmit}>

                    <h1 className={styles.heading}>Change Profile Picture</h1>

                    <input className={styles.file} style={{display: 'none'}} type="file" onChange={this.handleSelectedFile} ref={imgInput => this.imgInput = imgInput} />

                    <div className={styles.button} onClick={() => this.imgInput.click()}>Choose File</div>
                    
                    <p className={styles.fileName}>{this.state.selectedFile && this.state.selectedFile.name}</p>

                    {this.props.error ? <p style={{color: 'red'}}>{this.props.error}</p> : null }

                    <input className={styles.submit} type="submit" value='Submit' disabled={this.checkSubmitBtn()}/>
                    
                    
                </form>
                
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
        changeProfilePicture: (img) => dispatch(authActionCreators.changeProfilePicture(img))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangeProfilePicture);