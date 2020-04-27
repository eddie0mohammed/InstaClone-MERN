import React from 'react';

import styles from './NavItem.module.css';

const NavItem = (props) => {

  return (
    <li className={styles.navItem}>
      <div  className={styles.iconButton} onClick={() => props.setOpen(!props.open)}>
        {props.icon}
      </div>

      {props.open && props.children}
    </li>
  )
}

export default NavItem;