import React, { Component } from 'react';

import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import styles from './List.module.css';

import * as postActionCreators from '../../../Redux/Actions/PostActionCreators';



class List extends Component {

    renderPosts = () => {

        let posts = this.props.posts;
    
        if (this.props.userId){
            posts = posts.filter(elem => elem.author._id === this.props.userId);
        }
        return posts.map(elem => {
            
            return (
                <div key={elem._id} className={styles.imgContainer} onClick={() => this.props.history.push(`/post/${elem._id}`)}>
                    <img className={styles.img} src={`${elem.imageURL}`} alt="img"/>
                    <div className={styles.bar}>
                        <p className={styles.text}>Likes: {elem.likes.length}</p>
                    </div>
                </div>
            )
        });
    }

    render() {
        
        return (
            <div className={styles.container}>

                {this.props.posts &&  this.renderPosts()}   
                
                
                
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
        getAllPosts: () => dispatch(postActionCreators.getAllPosts()),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(List));