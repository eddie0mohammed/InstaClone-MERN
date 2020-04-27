import React, { Component } from 'react'

import styles from './Home.module.css';

import {connect} from 'react-redux';

import List from '../post/List/List';


class Home extends Component {
    render() {
        return (
            <div className={styles.home}>

                <h1 className={styles.heading}>Gallery</h1>

                {/* {this.props.isAuthenticated && 
                    <div className={styles.btn} onClick={() => this.props.history.push('/post/new')}>New</div>
                } */}

                <div className={styles.listContainer}>
                    
                    <List />

                </div>
                
            </div>
        )
    }
}

const mapStateToProps= (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);