import React, { useContext } from "react";
import { Context } from "../../main";
import { Link } from "react-router-dom";
import { FaFacebookF, FaYoutube, FaLinkedin } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";

const Footer = () => {
  const { isAuthorized } = useContext(Context);
  return (
    <footer className={isAuthorized ? "footerShow" : "footerHide"}>
      <div>All Rights Reserved &copy; By HireHub.</div>
      <div>
        <Link to={"https://www.facebook.com/hirehub"} target="_blank">
          <FaFacebookF />
        </Link>
        <Link to={"https://www.youtube.com/@hirehub"} target="_blank">
          <FaYoutube />
        </Link>
        <Link to={"https://www.instagram.com/hirehub/"} target="_blank">
          <RiInstagramFill />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
