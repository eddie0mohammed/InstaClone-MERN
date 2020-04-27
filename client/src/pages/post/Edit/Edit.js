
import React, { Component } from 'react';

import styles from './Edit.module.css';

import {connect} from 'react-redux';
import * as postActionCreators from '../../../Redux/Actions/PostActionCreators';

class Edit extends Component {

    state = {
        imageFile: '',
        description: ''
    }

    componentDidMount(){
        const postId = this.props.match.params.postId;
        if (this.props.posts.length > 0){

            const currentPost = this.props.posts.filter(elem => {
                return elem._id === postId;
            })[0];
            this.setState({
                description: currentPost.description
            });
        }
    }

    componentDidUpdate(prevProps){
        if (prevProps.posts !== this.props.posts){
            const postId = this.props.match.params.postId;
            const currentPost = this.props.posts.filter(elem => {
                return elem._id === postId;
            })[0];
            this.setState({
                description: currentPost.description
            });
        }

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
        const res = await this.props.editPost(this.state.imageFile, this.state.description, this.props.match.params.postId);
        // console.log(res);
        if (res.status === 'success'){
            this.props.history.push('/');
        }
    }




    checkSubmitBtn = () => {
        let disabled = true;
        if (this.state.imageFile || this.state.description){
            disabled = false;
        }
        return disabled;
    }

    render() {
        return (
            <div className={styles.container}>
                {this.props.posts.length > 0 &&

                <form className={styles.form} onSubmit={this.handleSubmit}>

                    <h1 className={styles.heading}>Edit Post</h1>


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
                    <p style={{marginTop: '1rem'}}>{this.state.imageFile && this.state.imageFile.name}</p>
                    
                    <label className={styles.label} htmlFor="image">Description</label>
                    <textarea className={styles.textarea} name="description" value={this.state.description} onChange={this.handleInputChange}/>


                    {/* <p style={{color: 'red'}}>{this.props.error}</p> */}
                    <input className={styles.submit} type="submit" value='Submit' disabled={this.checkSubmitBtn()}/>

                    

                </form>
                }
                
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        posts: state.post.posts
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        editPost: (imageFile, description, postId) => dispatch(postActionCreators.editPost(imageFile, description, postId)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Edit);