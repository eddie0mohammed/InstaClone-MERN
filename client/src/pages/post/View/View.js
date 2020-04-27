import React, { Component } from 'react';

import styles from './View.module.css';

import {connect} from 'react-redux';

import * as postActionCreators from '../../../Redux/Actions/PostActionCreators';

class View extends Component {

    state = {
        currentPost: null,
        commentBox: ''

    }

    componentDidMount(){
        const postId = this.props.match.params.postId;
        if (this.props.posts.length > 0){

            const currentPost = this.props.posts.filter(elem => {
                return elem._id === postId;
            })[0];
            this.setState({
                currentPost: currentPost
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
                currentPost: currentPost
            });
        }

    }

    handleDelete = async () => {
        const postId = this.props.match.params.postId;
        const res = await this.props.deletePost(postId);

        if (res.status === 'success'){
            this.props.history.push('/');
        }
    }

    handleLikeClick = async () => {
        await this.props.likePost(this.props.match.params.postId);
    }

    handleUnlikeClick = async () => {
        await this.props.unlikePost(this.props.match.params.postId);
    }

    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleCommentBoxSubmit = async (e) => {
        e.preventDefault();
        // console.log(this.state);
        
        const res = await this.props.addComment(this.state.commentBox, this.props.match.params.postId, this.props.user.username);
        if (res.status === 'success'){
            this.setState({
                commentBox: ''
            });
        }

    }

    renderButtons = () => {
        if (this.props.isAuthenticated){
            if (this.props.user._id === this.state.currentPost.author._id){
                return (
                    <>
                        <div className={styles.edit} onClick={() => this.props.history.push(`/post/edit/${this.state.currentPost._id}`)}>Edit</div>
                        <div className={styles.delete} onClick={this.handleDelete}>Delete</div>
                    </>
                )
            }else{
                if (this.state.currentPost.likes.includes(this.props.user._id)){
                    return (
                        <div className={styles.edit} onClick={this.handleUnlikeClick}>Unlike</div>
                    );
                }else{
                    return (
                        <div className={styles.edit} onClick={this.handleLikeClick}>Like</div>
                    );
                }

            }
        }
    }

    renderComments = () => {
        if (this.state.currentPost){
            return this.state.currentPost.comments.map((elem, i) => {
                return (
                <div key={i} className={styles.comment}>
                                    
                    <p className={styles.comment__author}>Author: {elem.username}</p>                                    
                    <p className={styles.comment__desc}>{elem.comment}</p>
                    {this.props.user && this.props.user._id === elem.authorId &&
                        <div className={styles.comment__delete} onClick={() => this.props.removeComment(i, this.props.match.params.postId)}>delete</div>
                    }
                </div>
                    
                )
            })
        }
    }

    checkCommentSubmitBtn = () => {
        let disabled = true;
        if (this.state.commentBox){
            disabled = false;
        }
        return disabled;
    }

    render() {
    
        return (
            <div >
               {this.state.currentPost &&
                <div className={styles.container}>
                    <div className={styles.left}>

                        <div className={styles.imgContainer}>
                            <img className={styles.img} src={`${this.state.currentPost.imageURL}`} alt="image1"/>
                        </div>
                        <div className={styles.details}>
                            <div className={styles.row}>
                                <p className={styles.likes}>Likes: {this.state.currentPost && this.state.currentPost.likes.length}</p>
                                {this.renderButtons()}
                            </div>
                            <p className={styles.author}>{this.state.currentPost.author.username}</p>
                            <p className={styles.desc}>{this.state.currentPost.description}</p>
                        </div>
                    </div>

                    <div className={styles.right}>
                        <div className={styles.commentsContainer}>

                            <div className={styles.commentBox}>
                                {this.renderComments()}
                                
                            </div>

                            <form className={styles.commentsForm} onSubmit={this.handleCommentBoxSubmit}>

                                <label htmlFor="commentBox" className={styles.label}>Add Comment</label>
                                <textarea name="commentBox" id="commentBox" className={styles.textarea} value={this.state.commentBox} onChange={this.handleInputChange}/>

                                <input className={styles.submit} type="submit" value="Add" disabled={this.checkCommentSubmitBtn()}/>

                            </form>
                            
                        </div>
                    </div>
                </div>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        posts: state.post.posts,
        isAuthenticated: state.auth.isAuthenticated,
        user: state.auth.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        deletePost: (postId) => dispatch(postActionCreators.deletePost(postId)),
        likePost: (postId) => dispatch(postActionCreators.likePost(postId)),
        unlikePost: (postId) => dispatch(postActionCreators.unlikePost(postId)),
        addComment: (comment, postId, username) => dispatch(postActionCreators.addComment(comment, postId, username)),
        removeComment: (index, postId) => dispatch(postActionCreators.removeComment(index, postId)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(View);