import React from "react";
import { Link, useHistory } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      

      <footer className="footer-distributed">
        <div className="footer-section">
          <h3>
          Cattaingroups
          </h3>
          <p className="footer-links">
            <a href="/" className="link-1">
              Home
            </a>
            <a href="/"></a>
            
            <a href="/">About Us</a>

            <a href="/"></a>
            
            <a href="/">Contact Us</a>
          </p>
          {/* <p className="footer-company-name">Company Name © 2015</p> */}
        </div>
  
        <div className="footer-section">
          <div>
            <i  className="fa fa-map-marker"></i>
            <p>
              <span> Khlong Sam,Pathumthani, </span> Thailand -12120
              </p>
          </div>
          <div>
            <i className="fa fa-phone"></i>
            <p>+91 93630 80589</p>
          </div>
          <div>
            <i className="fa fa-envelope"></i>
            <p>
              <a href="mailto:contact@cattain.com">contact@cattaingroups.com</a>
            </p>
          </div>
        </div>
  
        <div className="footer-section">
         
            <h3>About the company</h3>
            <p className="footer-company-about">
  Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br></br>
  Sed do eiusmod tempor incididunt ut labore et.<br></br>
  Ut enim ad minim veniam, quis nostrud exercitation ullamco.<br></br>
  Duis aute irure dolor in reprehenderit in voluptate .<br></br>
  Excepteur sint occaecat cupidatat non proident.
</p>

          <div className="footer-icons">
          <Link to="/">
                <i style={{ color: "#ffffff" }} className="fab fa-facebook-f"></i>
              </Link>
              <a href="https://www.instagram.com/"
            target=""
            >
                <i style={{ color: "#E101A8" }} className="fab fa-instagram"></i>
              </a>
              
              <Link to="/">
                <i style={{ color: "#b02325" }} className="fab fa-youtube"></i>
              </Link>
              <a href="https://api.whatsapp.com/send?phone="
            target="_blank"
            >
              <i className="fab fa-whatsapp" style={{ color: "#25D366" }} ></i>
            </a>
              
          </div>
        </div>
        
      </footer>

    
    {/* Top Header */}
       <div className="Announcement ">
        <div className="container">
          <div className="row">
            <div className="col-md-6 d-flex align-items-center display-none text-center">
             
              <p>Copyright © 2023 - cattaingroups.com </p>
            </div>
           
          </div>
        </div>
      </div> 
      
      
    
    </div>
  );
};

export default Footer;
