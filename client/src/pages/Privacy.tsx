import React from "react";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-green-100 max-w-xl w-full text-left">
        <h1 className="text-4xl font-bold text-green-700 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-6">Last Updated: March 17, 2025</p>
        <p className="text-gray-700 mb-4">
          At NutriFit, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our web application.
        </p>
        <h2 className="text-lg font-semibold text-green-700 mt-6 mb-2">Information We Collect</h2>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>Contact information (name, email address, phone number)</li>
          <li>Account credentials</li>
          <li>Health and fitness data (weight, height, activity levels, dietary preferences)</li>
          <li>Usage data and analytics</li>
        </ul>
        <h2 className="text-lg font-semibold text-green-700 mt-6 mb-2">How We Use Your Information</h2>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>Provide, maintain, and improve our services</li>
          <li>Personalize your experience</li>
          <li>Communicate with you</li>
          <li>Monitor and analyze usage patterns</li>
          <li>Ensure the security of our platform</li>
        </ul>
        <h2 className="text-lg font-semibold text-green-700 mt-6 mb-2">Data Security</h2>
        <p className="text-gray-700 mb-4">
          We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.
        </p>
        <h2 className="text-lg font-semibold text-green-700 mt-6 mb-2">Your Rights</h2>
        <p className="text-gray-700 mb-4">
          You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at <a href="https://mail.google.com/mail/?view=cm&fs=1&to=the.nutrifit.app@gmail.com" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">the.nutrifit.app@gmail.com</a>.
        </p>
        <h2 className="text-lg font-semibold text-green-700 mt-6 mb-2">Changes to This Privacy Policy</h2>
        <p className="text-gray-700 mb-4">
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
        </p>
        <h2 className="text-lg font-semibold text-green-700 mt-6 mb-2">Contact Us</h2>
        <p className="text-gray-700">
          If you have any questions about this Privacy Policy, please contact us at <a href="https://mail.google.com/mail/?view=cm&fs=1&to=the.nutrifit.app@gmail.com" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">the.nutrifit.app@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}
