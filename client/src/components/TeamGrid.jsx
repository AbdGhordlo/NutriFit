import React from "react";
import { Calendar, MapPin, Mail, Linkedin, Github } from "lucide-react";

export const creators = [
  {
    name: "Sarah Chen",
    role: "Co-Founder & CEO",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    description: "Passionate about revolutionizing health tech with AI-driven solutions. Former Google product manager with 8+ years in health tech.",
    status: "Currently leading strategic partnerships",
    location: "San Francisco, CA",
    linkedin: "#",
    email: "sarah@nutrifit.com"
  },
  {
    name: "Marcus Rodriguez",
    role: "Co-Founder & CTO",
    image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    description: "Full-stack developer and AI enthusiast. Previously at Tesla, building scalable systems for millions of users worldwide.",
    status: "Building our next-gen AI engine",
    location: "Austin, TX",
    github: "#",
    email: "marcus@nutrifit.com"
  },
  {
    name: "Dr. Amira Hassan",
    role: "Head of Nutrition Science",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    description: "Registered dietitian and nutrition researcher with PhD from Harvard. Published 50+ papers on personalized nutrition.",
    status: "Developing evidence-based meal algorithms",
    location: "Boston, MA",
    linkedin: "#",
    email: "amira@nutrifit.com"
  },
  {
    name: "James Park",
    role: "Lead UX Designer",
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
    description: "Design systems expert passionate about creating intuitive health experiences. Former design lead at Spotify and Airbnb.",
    status: "Crafting our mobile experience",
    location: "New York, NY",
    linkedin: "#",
    email: "james@nutrifit.com"
  }
];

export default function TeamGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {creators.map((creator, index) => (
        <div
          key={index}
          className="group bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 hover:scale-105 transition-all duration-300 ease-out cursor-pointer"
          style={{
            animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
          }}
        >
          <div className="relative mb-6">
            <div className="w-24 h-24 mx-auto rounded-full overflow-hidden group-hover:scale-110 transition-transform duration-300">
              <img
                src={creator.image}
                alt={creator.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white group-hover:animate-pulse"></div>
          </div>
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{creator.name}</h3>
            <p className="text-green-600 font-medium text-sm mb-3">{creator.role}</p>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">{creator.description}</p>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center text-gray-500">
              <Calendar className="w-4 h-4 mr-2 text-green-500" />
              <span>{creator.status}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <MapPin className="w-4 h-4 mr-2 text-green-500" />
              <span>{creator.location}</span>
            </div>
          </div>
          <div className="flex justify-center space-x-3 mt-6 pt-4 border-t border-gray-100">
            <a href={`mailto:${creator.email}`} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors">
              <Mail className="w-4 h-4" />
            </a>
            {creator.linkedin && (
              <a href={creator.linkedin} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {creator.github && (
              <a href={creator.github} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors">
                <Github className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
