import React from "react";
import { useUser } from "../user/userContext";
import "../../css/layout/RightSidebar.css";
import Link from "next/link";
import ImageWithLoader from "./imageWithLoader";

const RightSidebar = () => {
  const { user, logout } = useUser();

  const logoutHandler = () => {
    logout();
  };

  return (
    <>
  <div className="right-sidebar">
  <div className="account-container">
  {!user ? (
    <div className='right-image'>
    <div className="register-banner">
      <ImageWithLoader alt={'register-image'} src={`/images/homepage/register0.png`} />

      <Link href='/login'><button className="sign-in-btn">sign in</button></Link>
      <Link href='register'><button className="register-btn">register</button></Link>
    </div>
    </div>
  ) : (
    <>
     <div className="welcome-banner">
       <ImageWithLoader alt={'welcome-image'} src={`/images/homepage/register1.png`} />

       <button className="contact-btn" onClick={logoutHandler}>logout</button>
       <Link href='/profile'><button className="profile-btn">profile</button></Link>
    </div>

    </>
  )}


  <div
    className="shipment-banner"

  >
    <ImageWithLoader
          src={`/images/homepage/shipping.png`}
          alt={'shipping-image'}

    />
    <Link href='shipping'><button className="shipping-btn">learn more</button></Link>

  </div>

  </div>
</div>
    </>
  );
};

export default RightSidebar;
