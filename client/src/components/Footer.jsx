import React, { useState } from "react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { AiOutlineX } from "react-icons/ai";
import Logo from "../assets/imgs/logo-no-padding.png";
import { styles } from "./styles/FooterStyles";

export default function Footer() {
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);

  const getHoverStyle = (icon) => {
    if (hoveredIcon === icon) {
      switch (icon) {
        case "facebook":
          return { color: "#1877F2" };
        case "x":
          return { color: "black" };
        case "instagram":
          return { color: "#E4405F" };
        case "youtube":
          return { color: "#FF0000" };
        default:
          return {};
      }
    }
    return { color: "#9ca3af" };
  };

  /* Social icons we'll add to the bottom right of the page. We created an array of 
  objects so that we can map over them (It makes it look cleaner). */
  const socialIcons = [
    { id: "facebook", component: <FaFacebookF /> },
    { id: "x", component: <AiOutlineX /> },
    { id: "instagram", component: <FaInstagram /> },
    { id: "youtube", component: <FaYoutube /> },
  ];

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.leftSection}>
          <div style={styles.logoContainer}>
            <img src={Logo} style={styles.logo} alt="Logo" />
            <span style={styles.brandName}>NutriFit</span>
          </div>
          <span style={styles.copyright}>
            © 2025 NutriFit. All rights reserved.
          </span>
        </div>

        <div style={styles.rightSection}>
          <div style={styles.links}>
            {/* Notice: when the mouse hovers over any one of the links, its color will change */}
            {["About", "Contact", "Privacy"].map((item, index) => (
              <a
                key={index}
                href="#"
                style={{
                  ...styles.link,
                  color: hoveredLink === index ? "#4d7051" : "#4b5563",
                }}
                onMouseEnter={() => setHoveredLink(index)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {item}
              </a>
            ))}
          </div>

          <div style={styles.socialLinks}>
            {/* Notice: here we're mapping through the social links, and for each one, we check
            whether we're hovering over it. If we're, we set the hoveredIcon to the id of 
            element we're hovering over, which triggers a rerender, which changes the color
            when getHoverStyle is called below */}
            {socialIcons.map(({ id, component }) => (
              <a
                key={id}
                href="#"
                style={{ ...styles.socialIcon, ...getHoverStyle(id) }}
                onMouseEnter={() => setHoveredIcon(id)}
                onMouseLeave={() => setHoveredIcon(null)}
              >
                {component}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
