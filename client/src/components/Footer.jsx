import React, { useState, useRef } from "react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { AiOutlineX } from "react-icons/ai";
import Logo from "../assets/imgs/logo-no-padding.png";
import { styles } from "./styles/FooterStyles";
import { Link } from "react-router-dom";

export default function Footer() {
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const modalRef = useRef(null);

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

  /* Social icons with their respective URLs */
  const socialIcons = [
    { id: "facebook", component: <FaFacebookF />, url: "https://facebook.com" },
    { id: "x", component: <AiOutlineX />, url: "https://x.com" },
    { id: "instagram", component: <FaInstagram />, url: "https://instagram.com" },
    { id: "youtube", component: <FaYoutube />, url: "https://youtube.com" },
  ];

  // Content for the modal sections
  const modalContent = {
    about: {
      title: "About NutriFit",
      content: `
        <p>NutriFit is a comprehensive web-based application aimed at assisting users in reaching their nutritional and physical fitness goals through personalized meal planning, workout routines, and progress monitoring.</p>
        <p>The application utilizes artificial intelligence to offer users personalized dietary suggestions and workout routines based on the individual's distinct tastes, fitness level, budget constraints, and available ingredients. This approach guarantees users are given realistic and practical advice that suits their specific situation and requirements.</p>
        <p>In addition to merely creating a meal plan and exercise regime, NutriFit includes motivational features that engage users to take an active role. Users can monitor several facets of their progress, such as weight changes, compliance with dietary schedules, and physical activity success using an interactive and user-friendly dashboard. The program's gamification elements, such as streaks of accomplishment and rewards, are meant to promote repeated use and assist users in adhering to their health regimens.</p>
      `
    },
    contact: {
      title: "Contact Us",
      content: `
        <p>We'd love to hear from you! Please reach out to us using any of the methods below:</p>
        <div>
          <strong>Email:</strong> support@nutrifit.com
        </div>
        <div>
          <strong>Phone:</strong> +1 (555) 123-4567
        </div>
        <div>
          <strong>Address:</strong> 123 Nutrition Way, Fitness Valley, CA 94123
        </div>
        <p>Our support team is available Monday through Friday, 9am to 5pm EST.</p>
      `
    },
    privacy: {
      title: "Privacy Policy",
      content: `
        <h3>Privacy Policy for NutriFit</h3>
        <p><strong>Last Updated: March 17, 2025</strong></p>
        
        <p>At NutriFit, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our web application.</p>
        
        <h4>Information We Collect</h4>
        <p>We collect personal information that you voluntarily provide to us, including but not limited to:</p>
        <ul>
          <li>Contact information (name, email address, phone number)</li>
          <li>Account credentials</li>
          <li>Health and fitness data (weight, height, activity levels, dietary preferences)</li>
          <li>Usage data and analytics</li>
        </ul>
        
        <h4>How We Use Your Information</h4>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Personalize your experience</li>
          <li>Communicate with you</li>
          <li>Monitor and analyze usage patterns</li>
          <li>Ensure the security of our platform</li>
        </ul>
        
        <h4>Data Security</h4>
        <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>
        
        <h4>Your Rights</h4>
        <p>You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at privacy@nutrifit.com.</p>
        
        <h4>Changes to This Privacy Policy</h4>
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
        
        <h4>Contact Us</h4>
        <p>If you have any questions about this Privacy Policy, please contact us at privacy@nutrifit.com.</p>
      `
    }
  };

  // Handle opening a section in the modal
  const openSection = (section) => {
    setActiveSection(section);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  // Handle closing the modal
  const closeModal = () => {
    setActiveSection(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  // Close modal when clicking outside of content
  const handleModalClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  return (
    <>
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
              <Link
                to="/about"
                style={{
                  ...styles.link,
                  color: hoveredLink === 0 ? "#4d7051" : "#4b5563",
                }}
                onMouseEnter={() => setHoveredLink(0)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                About
              </Link>
              <Link
                to="/contact"
                style={{
                  ...styles.link,
                  color: hoveredLink === 1 ? "#4d7051" : "#4b5563",
                }}
                onMouseEnter={() => setHoveredLink(1)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                Contact
              </Link>
              <Link
                to="/privacy"
                style={{
                  ...styles.link,
                  color: hoveredLink === 2 ? "#4d7051" : "#4b5563",
                }}
                onMouseEnter={() => setHoveredLink(2)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                Privacy
              </Link>
            </div>

            <div style={styles.socialLinks}>
              {socialIcons.map(({ id, component, url }) => (
                <a
                  key={id}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
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

      {/* Modal for About/Contact/Privacy */}
      {activeSection && activeSection !== "privacy" && (
        <div style={styles.modal.overlay} onClick={handleModalClick}>
          <div style={styles.modal.container} ref={modalRef}>
            <div style={styles.modal.header}>
              <h2 style={styles.modal.title}>{modalContent[activeSection].title}</h2>
              <button style={styles.modal.closeButton} onClick={closeModal}>×</button>
            </div>
            <div 
              style={styles.modal.content}
              dangerouslySetInnerHTML={{ __html: modalContent[activeSection].content }}
            />
          </div>
        </div>
      )}
    </>
  );
}
