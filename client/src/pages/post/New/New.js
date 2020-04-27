
import React, { Component } from 'react';

import styles from './New.module.css';

import {connect} from 'react-redux';

import * as postActionCreators from '../../../Redux/Actions/PostActionCreators';

class New extends Component {

    state = {
        imageFile: '',
        description: ''
    }

    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    
    handleSelectedFile = (e) => {
        this.setState({
            imageFile: e.target.files[0]
        });
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(this.state);

        const res = await this.props.createPost(this.state.imageFile, this.state.description);
        // console.log(res);
        if (res.status === 'success'){
            this.props.history.push('/');
        }
    }




    checkSubmitBtn = () => {
        let disabled = true;
        if (this.state.imageFile && this.state.description){
            disabled = false;
        }
        return disabled;
    }

    render() {
        
        return (
            <div className={styles.container}>

                <form className={styles.form} onSubmit={this.handleSubmit}>

                    <h1 className={styles.heading}>New Post</h1>


                    <label className={styles.label} htmlFor="image">Image</label>
                    <input 
                        className={styles.input} 
                        style={{display: 'none'}}
                        type="file" 
                        name='imageFile' 
                        onChange={this.handleSelectedFile} 
                        ref={fileInput => this.fileInput = fileInput} 
                        />

                    <div
                        className={styles.button} 
                        onClick={() => this.fileInput.click()} 
                        >
                            Choose File
                    </div>
                    <p className={styles.text}>{this.state.imageFile && this.state.imageFile.name}</p>
                    
                    <label className={styles.label} htmlFor="image">Description</label>
                    <textarea className={styles.textarea} name="description" value={this.state.description} onChange={this.handleInputChange}/>


                    <p style={{color: 'red', marginTop: '1rem'}}>{this.props.error}</p>
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
        createPost: (imageFile, description) => dispatch(postActionCreators.createPost(imageFile, description)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(New);