import React from "react";
import {
  FaFacebookMessenger,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { SiZalo } from "react-icons/si"; // cài react-icons nếu chưa có

import "./FloatingContact.css";

const FloatingContact = () => {
  return (
    <div className="floating-contact">
      {/* Zalo */}
      <a
        href="https://zalo.me/84352207042"
        target="_blank"
        rel="noopener noreferrer"
      >
        <SiZalo size={28} color="#0068FF" />
      </a>

      {/* Messenger */}
      <a
        href="https://m.me/tuankhu4hahoa"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaFacebookMessenger size={28} color="#0099FF" />
      </a>

      {/* Email */}
      <a
        href="https://mail.google.com/mail/?view=cm&fs=1&to=tuantvhe173048@fpt.edu.vn&su=Liên%20hệ%20mua%20hàng&body=Chào%20bạn,%0ATôi%20muốn%20liên%20hệ%20với%20bạn%20để%20..."
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaEnvelope size={28} color="#FF5722" />
      </a>

      {/* Google Maps */}
      <a
        href="https://maps.app.goo.gl/NMsKuhLRZx9UoPRJA"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaMapMarkerAlt size={28} color="#FF9800" />
      </a>
    </div>
  );
};

export default FloatingContact;
