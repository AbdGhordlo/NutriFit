import React from "react";
import { Users, Heart, Target, Award } from "lucide-react";
import TeamGrid from "../components/TeamGrid";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Users className="w-4 h-4 mr-2" />
            Meet the Team Behind NutriFit
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            About <span className="text-green-600">NutriFit</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Empowering your health journey through intelligent nutrition and fitness solutions
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-green-100">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <div className="space-y-6 text-gray-600 leading-relaxed">
                  <p>
                    NutriFit is a comprehensive web-based application aimed at assisting users in reaching their nutritional and physical fitness goals through personalized meal planning, workout routines, and progress monitoring.
                  </p>
                  <p>
                    The application utilizes artificial intelligence to offer users personalized dietary suggestions and workout routines based on the individual's distinct tastes, fitness level, budget constraints, and available ingredients.
                  </p>
                  <p>
                    Our gamification elements, such as streaks of accomplishment and rewards, are designed to promote repeated use and assist users in adhering to their health regimens.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-2xl text-center">
                  <Target className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Personalized</h3>
                  <p className="text-sm text-gray-600">AI-driven recommendations tailored to you</p>
                </div>
                <div className="bg-blue-50 p-6 rounded-2xl text-center">
                  <Award className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Gamified</h3>
                  <p className="text-sm text-gray-600">Achievements and streaks to keep you motivated</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-2xl text-center">
                  <Heart className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Holistic</h3>
                  <p className="text-sm text-gray-600">Nutrition and fitness in one platform</p>
                </div>
                <div className="bg-orange-50 p-6 rounded-2xl text-center">
                  <Users className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Community</h3>
                  <p className="text-sm text-gray-600">Connect with like-minded health enthusiasts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Creators</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate individuals behind NutriFit's innovative approach to health and wellness
            </p>
          </div>
          <TeamGrid />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Health?</h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who have already started their journey with NutriFit's personalized approach to wellness.
            </p>
            <button className="bg-white text-green-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
              Get Started Today
            </button>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
