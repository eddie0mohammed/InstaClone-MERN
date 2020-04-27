
import React, { Component } from 'react';

import styles from './Header.module.css';

import {Link, withRouter } from 'react-router-dom';
import {connect} from 'react-redux';

import NavItem from '../Dropdown/NavItem/NavItem';
import DropdownMenu from '../Dropdown/DropdownMenu/DropdownMenu';
import {ReactComponent as CaretIcon} from '../Dropdown/icons/caret.svg';

// import * as authActionCreators from '../../Redux/Actions/AuthActionCreators';

class Header extends Component {

    state = {
        open: false
    }

    toggleMenuState = () => {
        this.setState({
            open: !this.state.open
        });
    }

    // handleLogout = () => {
    //     this.props.logout();

    //     this.props.history.push('/auth/login');
    // }

    

    render() {
        return (
            <div className={styles.header}>

                <Link to="/" className={styles.logo}>Logo</Link>
                
                <div className={styles.linksContainer}>
                    {!this.props.isAuthenticated ? 
                        <ul className={styles.links}>
                            <li className={styles.link}><Link to='/auth/login' className={styles.Link} >Login</Link></li>
                            <li className={styles.link}><Link to='/auth/register' className={styles.Link} >Register</Link></li>
                        </ul>
                        :
                        <>
                        {/* <ul className={styles.links}>
                            <li className={styles.link}><Link to='/auth/settings' className={styles.Link} >Settings</Link></li>
                            <li className={styles.link}><div className={styles.Link} onClick={this.handleLogout}>Logout</div></li>
                        </ul> */}

                        <div className={styles.imgContainer}>
                            {this.props.user && 
                                <img className={styles.img} src={this.props.user.profilePic} alt="profile"/>
                            }
                        </div>

                        <NavItem icon={<CaretIcon />} open={this.state.open} setOpen={this.toggleMenuState}>
                            <DropdownMenu setOpen={this.toggleMenuState}/>
                        </NavItem>
                        </>
                    }

                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        user: state.auth.user
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        // logout: () => dispatch(authActionCreators.logout()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));
