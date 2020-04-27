import React, {useState} from 'react';

import styles from './DropdownMenu.module.css';

import {CSSTransition} from 'react-transition-group';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

import DropdownItem from '../DropdownItem/DropdownItem';
import {ReactComponent as CogIcon} from '../icons/cog.svg';
import {ReactComponent as ChevronIcon} from '../icons/chevron.svg';
import {ReactComponent as ArrowIcon} from '../icons/arrow.svg';

import * as authActionCreators from '../../../Redux/Actions/AuthActionCreators';


const DropdownMenu = (props) => {
    const [activeMenu, setActiveMenu] = useState('main');
    const [menuHeight, setMenuHeight] = useState(null);

    const calcHeight = (el) => {
        const height = el.offsetHeight + 40;
        setMenuHeight(height);
    }


  return (
    <div className={styles.dropdown} style={{height: menuHeight}}>

      <CSSTransition in={activeMenu === 'main'} unmountOnExit timeout={500} classNames='menu-primary' onEnter={calcHeight}>

        <div className={styles.menu}>
            <DropdownItem toggleMenu={props.setOpen} click={() => props.history.push('/auth/myImages')}>My Images</DropdownItem>

            <DropdownItem
              leftIcon={<CogIcon />}
              rightIcon={<ChevronIcon />}
              goToMenu="settings"
              setActiveMenu={setActiveMenu}
              
              >
                Settings
            </DropdownItem>
            
            <DropdownItem toggleMenu={props.setOpen} logout={props.logout}>Logout</DropdownItem>

          </div>
      
        </CSSTransition> 

        <CSSTransition in={activeMenu === 'settings'} unmountOnExit timeout={500} classNames='menu-secondary' onEnter={calcHeight}>

            <div className={styles.menu}>
              <DropdownItem
                leftIcon={<ArrowIcon />}
                goToMenu="main"
                setActiveMenu={setActiveMenu}
              >

              </DropdownItem>

              <DropdownItem click={() => props.history.push('/auth/settings')} toggleMenu={props.setOpen}>User Settings</DropdownItem>
              <DropdownItem click={() => props.history.push('/auth/reset-mypassword')} toggleMenu={props.setOpen}>Change Password</DropdownItem>
              <DropdownItem click={() => props.history.push('/auth/change-profilePicture')} toggleMenu={props.setOpen}>Change Profile Picture</DropdownItem>
              
              
              
              </div>

          </CSSTransition> 

    </div>
  )
}

const mapStateToProps = (state) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(authActionCreators.logout()),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DropdownMenu));