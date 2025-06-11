import React from "react";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-green-100 max-w-xl w-full text-center">
        <h1 className="text-4xl font-bold text-green-700 mb-4">Contact Us</h1>
        <p className="text-gray-600 mb-8">
          Have questions or feedback? Reach out to the NutriFit team and we'll get back to you soon!
        </p>
        <div className="text-left space-y-4">
          <div>
            <span className="font-semibold text-gray-800">Email:</span>{" "}
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=the.nutrifit.app@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline"
            >
              the.nutrifit.app@gmail.com
            </a>
          </div>
          <div>
            <span className="font-semibold text-gray-800">Address:</span> Ankara, Turkey
          </div>
        </div>
      </div>
    </div>
  );
}
