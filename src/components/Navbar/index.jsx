import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom';
import ConnectionButton from '../ConnectionButton'
import "./Navbar.css"

const Navbar = () => {

  const [openNav, setOpenNav] = useState(false);

  return (
    <Fragment>
        <nav>
        <div className="logo">Ubiquity</div>
        <span className="menubtn" onClick={() => setOpenNav(true)}>
          &#9776;
        </span>

        <div className="navLinks">
          <ul>
          <li>
          <Link to="/">Home</Link>
            </li>
          <li>
          <Link to="/address">Address</Link>
            </li>
          <li>
          <Link to="/nft">NFT</Link>
            </li>
          <ConnectionButton />
          {/* <button type="button" id="connectBtn">
              Connect Wallet
            </button> */}
          </ul>
        </div>
      </nav>

      <div className="sideNav" id="sidenav">
        <a href="#" className="closeBtn" onClick={() => setOpenNav(false)}>
          {" "}
          &#10006;
        </a>
        <a href="#">Home</a>
        <a href="#">Contact</a>
        <a href="#">
          <button type="button">Connect Wallet</button>{" "}
        </a>
      </div>
    </Fragment>
  )
}

export default Navbar