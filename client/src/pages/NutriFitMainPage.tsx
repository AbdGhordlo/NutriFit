import React, { useState } from "react";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const NutriFitMainPage: React.FC = () => {
  const handleRippleEffect = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    const button = e.currentTarget;
    const ripple = document.createElement("span");
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = e.clientX - rect.left - size / 2 + "px";
    ripple.style.top = e.clientY - rect.top - size / 2 + "px";
    ripple.style.position = "absolute";
    ripple.style.borderRadius = "50%";
    ripple.style.background = "rgba(255, 255, 255, 0.3)";
    ripple.style.transform = "scale(0)";
    ripple.style.animation = "ripple 0.6s linear";
    ripple.style.pointerEvents = "none";

    button.style.position = "relative";
    button.style.overflow = "hidden";
    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  };
  const navigate = useNavigate();
  const handleGetStarted = (e) => {
    handleRippleEffect(e);
    navigate("/register");
  };
  const handleSignIn = (e) => {
    handleRippleEffect(e);
    navigate("/login");
  };

  const FloatingVeggies: React.FC = () => (
    <div className="fixed inset-0 pointer-events-none z-0">
      {["🥦", "🥕", "🏋️‍♂️", "🍎", "🥬"].map((veggie, index) => (
        <div
          key={index}
          className={`absolute text-6xl opacity-10 animate-bounce`}
          style={{
            top: `${10 + index * 15}%`,
            left: `${10 + index * 20}%`,
            animationDelay: `${index * 2}s`,
            animationDuration: "6s",
          }}
        >
          {veggie}
        </div>
      ))}
    </div>
  );

  const HeroSection: React.FC = () => (
    <section className="grid lg:grid-cols-2 gap-40 items-center min-h-[80vh] pt-8">
      <div className="bg-white/95 p-12 rounded-3xl backdrop-blur-md shadow-2xl animate-fade-in-left">
        <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          <span className="text-green-500 font-extrabold">NutriFit</span>
          <br />
          Your goals
          <br />
          start here!
        </h1>
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          NutriFit is designed to make your health journey enjoyable &
          sustainable. Start with us today, small steps lead to big results! 💚
        </p>
        <div className="space-y-4">
          <div className="flex items-left justify-start">
            <button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 text-lg font-bold rounded-full transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-green-500/40 block"
            >
              Get Started Now
            </button>
          </div>
          <a
            href="#"
            onClick={handleSignIn}
            className="px-0 py-0 m-0 text-left text-gray-500 font-bold hover:text-gray-700 hover:underline transition-colors duration-300 bg-transparent border-none cursor-pointer"
          >
            Already have an account? Sign in
          </a>
        </div>
        {/* Sağ taraf: Görsel */}
      </div>
      <div className="flex justify-center items-center">
        <img
          src="/TAGZ.png"
          alt="NutriFit mockup"
          className="max-w-full h-auto object-contain animate-fade-in-right drop-shadow-xl"
        />
      </div>
    </section>
  );

  interface FeatureCardProps {
    icon: string;
    title: string;
    description: string;
  }

  const FeatureCard: React.FC<FeatureCardProps> = ({
    icon,
    title,
    description,
  }) => (
    <div className="bg-white/95 p-8 rounded-2xl text-center shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl group">
      <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 text-gray-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );

  const FeaturesSection: React.FC = () => {
    const features = [
      {
        icon: "📊",
        title: "Smart Tracking",
        description: "Easily track your daily calorie intake and activities.",
      },
      {
        icon: "🍽️",
        title: "Personal Nutrition",
        description: "Get personalized meal plans and food recommendations.",
      },
      {
        icon: "🎯",
        title: "Goal-Focused",
        description: "Set your weight loss goals and track them step by step.",
      },
      {
        icon: "👥",
        title: "Community Support",
        description:
          "Connect with people who share the same goals and stay motivated.",
      },
      {
        icon: "🏋️‍♂️", // Dumbbell/sport icon
        title: "Personalized Workouts",
        description:
          "Connect with people who share the same goals and stay motivated.",
      },
      {
        icon: "📅", // Calendar icon
        title: "Meal Planning",
        description:
          "Plan your meals ahead of time to stay on track with your nutrition.",
      },
      {
        icon: "🔔", // Notification icon
        title: "Reminders",
        description:
          "Stay consistent with meal, workout, and hydration reminders—plus daily health tips and motivation.",
      },
      {
        icon: "🌟", // Star icon
        title: "Achievements",
        description:
          "Earn badges and rewards for reaching your health milestones.",
      },
    ];

    return (
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </section>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-green-100 to-green-200 text-gray-800">
      <FloatingVeggies />
      <main className="relative z-10">
        <div className="max-w-6xl mx-auto px-1 py-1">
          <HeroSection />
          <FeaturesSection />
        </div>
      </main>
      <style>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }

        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-left {
          animation: fade-in-left 1s ease-out;
        }

        .animate-fade-in-right {
          animation: fade-in-right 1s ease-out;
        }
      `}</style>
      <Footer /> {/* ✅ Add this line here */}
    </div>
  );
};

export default NutriFitMainPage;
