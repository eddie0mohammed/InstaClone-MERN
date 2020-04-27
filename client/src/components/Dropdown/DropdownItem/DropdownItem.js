import React from 'react';

import styles from './DropdownItem.module.css';
import {withRouter} from 'react-router-dom';

const DropdownItem = (props) => {

    const handleClick = (e) => {
        if (props.goToMenu && props.setActiveMenu){
            props.setActiveMenu(props.goToMenu);
        }else{
            
            if (props.click){
                props.click();
            }
            if (props.toggleMenu ){
                props.toggleMenu();
            }

            if (props.logout){
                props.logout();
                props.history.push('/auth/login');
            }
        }
    }

    return (
        <div className={styles.menuItem} onClick={handleClick}>

            <span className={`${styles.menuIconBtn} ${styles.iconButton}`}>{props.leftIcon}</span>

                   <p className={styles.text}>{props.children}</p>
            
            <span className={`${styles.iconButton} ${styles.iconRight} `}>{props.rightIcon}</span>
        </div>
    )
}


export default withRouter(DropdownItem);