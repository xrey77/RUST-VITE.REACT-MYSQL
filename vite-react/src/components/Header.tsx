import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import { Link,useNavigate } from "react-router-dom";
import Login from "./Login.tsx";
import Register from "./Register.tsx";
import { useState, useEffect } from "react";
import jQuery from 'jquery';

export default function Header() {
  const [username, setUsername] = useState<string>('');
  const [userpic, setUserpic] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const usrname = sessionStorage.getItem('USERNAME');    
    if (usrname === null) {
      setUsername('');
    } else {
      setUsername(usrname);
    }
    const usrpic = sessionStorage.getItem("USERPIC");
    if (usrpic === null) {
      setUserpic('/images/pix.png');
    } else {
      let userpic: any = usrpic;
      jQuery('#pic').attr('src', userpic);
      setUserpic(userpic);
    }
  },[username, userpic]);

  const Logout = () => {
    sessionStorage.removeItem('USERID');
    sessionStorage.removeItem('USERNAME');
    sessionStorage.removeItem('USERPIC');
    sessionStorage.removeItem('TOKEN');
    navigate('/'); 
    location.reload();
  }
  return (
    <>
<nav className="navbar navbar-expand-lg bg-dark">
  <div className="container-fluid">
    <Link className="navbar-brand" to="/"><img className="logo" src="http://127.0.0.1:3000/assets/images/logo.png" alt=""/></Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">   
      <span className="navbar-dark navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className="nav-link text-white" aria-current="page" to="/about">About Us</Link>
        </li>
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle text-white" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Products
          </a>
          <ul className="dropdown-menu">
            <li><Link className="dropdown-item" to="/productlist">Prodcuts List</Link></li>
            <li><Link className="dropdown-item" to="/productcatalog">Products Catalog</Link></li>
            <li><hr className="dropdown-divider"/></li>
            <li><Link className="dropdown-item" to="/productsearch">Product Search</Link></li>
          </ul>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-white" to="/contact">Contact Us</Link>
        </li>
      </ul>
      { username === '' ? (
          <ul className="navbar-nav mr-auto">
          <li className="nav-item">
              <a className="nav-link text-white" href="#" data-bs-toggle="modal" data-bs-target="#staticLogin">Login</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="#" data-bs-toggle="modal" data-bs-target="#staticRegister">Register</a>
            </li>
          </ul>  
      ): (
        <ul className="navbar-nav mr-auto mb-2 mb-lg-0">
          <li className="nav-item dropdown">
          <Link className="nav-link dropdown-toggle" to="/#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><img id="pic" className="user" src={userpic} alt=""/>&nbsp;<span className='text-white'>{username}</span></Link>
          <ul className="dropdown-menu">
            <li><a onClick={Logout} className="dropdown-item" href="/#">Log-Off</a></li>
            <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
            <li><hr className="dropdown-divider"/></li>
            <li><Link className="dropdown-item" to="/#">Messenger</Link></li>
          </ul>
          </li>
        </ul>        
      )}      
    </div>
  </div>
</nav>    
{/*  OFF-CANVAS */}
<div className="offcanvas offcanvas-end" data-bs-scroll="true" tabIndex={-1} id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
    <div className="offcanvas-header bg-success">
      <h5 className="offcanvas-title text-white" id="offcanvasWithBothOptionsLabel">Drawer Menu</h5>
      <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>    
      </div>
    <div className="offcanvas-body">
  
      <ul className="nav flex-column">
        <li className="nav-item" data-bs-dismiss="offcanvas">
          <Link className="nav-link text-dark embossed " to="/about">About Us</Link>
        </li>
        <li><hr/></li>
        <li className="nav-item dropdown">
          <Link className="nav-link dropdown-toggle text-dark embossed" to="/#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Products
          </Link>
          <ul className="dropdown-menu">
            <li data-bs-dismiss="offcanvas">
              <Link className="dropdown-item" to="/productlist">Product List</Link></li>
            <li data-bs-dismiss="offcanvas">
              <Link className="dropdown-item" to="/productcatalog">Product Catalogs</Link></li>
            <li><hr className="dropdown-divider"/></li>
            <li data-bs-dismiss="offcanvas">
              <Link className="dropdown-item" to="/productsearch">Product Search</Link></li>
          </ul>
        </li>
        <li><hr/></li>
  
        <li className="nav-item" data-bs-dismiss="offcanvas">
          <Link className="nav-link text-dark embossed" to="/contact">Contact</Link>  
        </li>
        <li><hr/></li>

        { username === '' ? (
        <ul className="nav flex-column">  
        <li data-bs-dismiss="offcanvas" className="nav-item">
          <Link className="nav-link text-dark embossed" aria-current="page" to="/#" data-bs-toggle="modal" data-bs-target="#staticLogin">Login</Link>
        </li>
        <li><hr/></li>
        <li data-bs-dismiss="offcanvas" className="nav-item">
          <Link className="nav-link text-dark embossed" aria-current="page" to="/#" data-bs-toggle="modal" data-bs-target="#staticRegister">Register</Link>
        </li>     
        <li><hr/></li>                 
        </ul>
        ):
        <>   
        <ul className="nav">  
          <li className="nav-item dropdown">
            <Link className="nav-link dropdown-toggle" to="/#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <img className="user" src={userpic} alt=""/>&nbsp;<span className="text-dark embossed"> {username}</span>
            </Link>
            <ul className="dropdown-menu">
              <li data-bs-dismiss="offcanvas">
                <a onClick={Logout} className="dropdown-item" href="/#">Logout</a></li>
              <li data-bs-dismiss="offcanvas">
                <Link className="dropdown-item" to="/profile">Profile</Link></li>
              <li><hr className="dropdown-divider"/></li>
              <li data-bs-dismiss="offcanvas">
                <Link className="dropdown-item" to="/#">Messenger</Link></li>
            </ul>
          </li>
        </ul>           
        <li><hr/></li>
        </>

        }
      </ul>
  </div>
  </div>
      {/* END-OFF CANVAS   */}
<Login/>
<Register/>
</>
  )
}
