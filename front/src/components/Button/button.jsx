import React from 'react';
import './button.css';

const Button = (props) => {
    return (
        <a className="login-button" href={props.hrefUrl}>
            {props.text}
        </a>
    )
}

export default Button;
