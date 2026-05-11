import React from 'react';
import './Support.css';

export default function Support() {
  return (
    <div className="support-container">
      <h2 className="support-title">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1827/1827272.png"
          alt="Support Icon"
          className="support-icon"
        />
        Support Center
      </h2>

      <div className="support-card">
        {/* Contact Info */}
        <section className="support-section">
          <h3>Contact Information</h3>

          <p className="support-item">
            <img src="https://cdn-icons-png.flaticon.com/512/597/597177.png" alt="Phone" />
            <span><strong>Phone:</strong> +1 (732) 555‑1234</span>
          </p>

          <p className="support-item">
            <img src="https://cdn-icons-png.flaticon.com/512/732/732200.png" alt="Email" />
            <span><strong>Email:</strong> support@example.com</span>
          </p>

          <p className="support-item">
            <img src="https://cdn-icons-png.flaticon.com/512/854/854878.png" alt="Clock" />
            <span><strong>Support Hours:</strong> 9:00 AM – 6:00 PM (Mon–Fri)</span>
          </p>
        </section>

        {/* Address */}
        <section className="support-section">
          <h3 className="support-heading">Office Address</h3>

          <div className="support-address">
            <img
              src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
              alt="Location"
              className="support-address-icon"
            />

            <div className="support-address-text">
              <div className="support-address-line">123 Business Tower</div>
              <div className="support-address-line">Downtown Street</div>
              <div className="support-address-line">Edison, New Jersey, USA</div>
            </div>
          </div>
        </section>

        {/* Google Map */}
        <section className="support-section">
          <h3>Find Us on Map</h3>

          <div className="map-container">
           <iframe
            title="Google Map"
            width="100%"
            height="300"
            loading="lazy"
            allowFullScreen
            src="https://www.google.com/maps?q=40.5187,-74.4121&z=15&output=embed"
          ></iframe>
          </div>

          <p className="map-note">
            * Replace <strong>YOUR_GOOGLE_MAP_API_KEY</strong> with your actual Google Maps API key.
          </p>
        </section>

        {/* Illustration */}
        <section className="support-section">
          <img
            src="https://cdn.dribbble.com/users/1787323/screenshots/6188364/support.gif"
            alt="Support Illustration"
            className="support-image"
          />
        </section>
      </div>
    </div>
  );
}
