import React, { Component } from 'react'

import styles from './MyPosts.module.css';

import {connect} from 'react-redux';

import List from '../List/List';


class MyPosts extends Component {
    render() {
        return (
            <div className={styles.home}>

                <h1 className={styles.heading}>My Images</h1>

                {/* {this.props.isAuthenticated && 
                    <div className={styles.btn} onClick={() => this.props.history.push('/post/new')}>New</div>
                } */}

                <div className={styles.listContainer}>
                    
                    <List userId={this.props.userId}/>

                </div>
                
            </div>
        )
    }
}

const mapStateToProps= (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        userId: state.auth.user ? state.auth.user._id : null
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyPosts);