import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import '../../styles/navBar.css'
import logo from '../../assets/logo.png'
 
export const NavBar = () => {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark bg shadow">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ml-auto mr-auto">
                        <li className="nav-item">
                            <NavLink to="/Buscaminas" className="nav-link">Buscaminas</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/Puntajes" className="nav-link">Puntajes</NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}
