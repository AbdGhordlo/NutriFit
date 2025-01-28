import React, { useState } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa'; // Importing from react-icons
import { AiOutlineX } from "react-icons/ai";
import Logo from '../assets/imgs/logo-no-padding.png';
import { styles } from './styles/FooterStyles';

export default function Footer() {
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const getHoverStyle = (icon) => {
    if (hoveredIcon === icon) {
      switch (icon) {
        case 'facebook':
          return { color: '#1877F2' };
        case 'x':
          return { color: 'black' };
        case 'instagram':
          return { color: '#E4405F' };
        case 'youtube':
          return { color: '#FF0000' };
        default:
          return {};
      }
    }
    return { color: '#9ca3af' }; // Default color
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.leftSection}>
          <div style={styles.logoContainer}>
            <img src={Logo} style={styles.logo} alt="Logo" />
            <span style={styles.brandName}>NutriFit</span>
          </div>
          <span style={styles.copyright}>© 2025 NutriFit. All rights reserved.</span>
        </div>

        <div style={styles.rightSection}>
          <div style={styles.links}>
            <a href="#" style={styles.link}>
              About
            </a>
            <a href="#" style={styles.link}>
              Contact
            </a>
            <a href="#" style={styles.link}>
              Privacy
            </a>
          </div>

          <div style={styles.socialLinks}>
            <a
              href="#"
              style={{ ...styles.socialIcon, ...getHoverStyle('facebook') }}
              onMouseEnter={() => setHoveredIcon('facebook')}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              style={{ ...styles.socialIcon, ...getHoverStyle('x') }}
              onMouseEnter={() => setHoveredIcon('x')}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <AiOutlineX />
            </a>
            <a
              href="#"
              style={{ ...styles.socialIcon, ...getHoverStyle('instagram') }}
              onMouseEnter={() => setHoveredIcon('instagram')}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              style={{ ...styles.socialIcon, ...getHoverStyle('youtube') }}
              onMouseEnter={() => setHoveredIcon('youtube')}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
