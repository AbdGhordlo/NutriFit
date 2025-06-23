import React from "react";
import { Calendar, MapPin, Linkedin, Github } from "lucide-react";
import PictureHussein from '../assets/imgs/Hussein Abdikarim - Nutrifit.jpg';
import PictureAhmet from '../assets/imgs/ahmeyfotos.jpg';
import PictureAbdallah from '../assets/imgs/Abdallah Ghordlo.jpg';
import PictureBasme from '../assets/imgs/Basme Zantout.png';

export const creators = [
  {
    name: "Abdallah Ghordlo",
    role: "Computer Engineering Student",
    image: PictureAbdallah,
    description: "Senior Computer Engineering Student at TED University, with a secondary field in Applied Data Analytics. Pationate about Web Development and Machine Learning.",
    status: "Student at TED University",
    location: "Ankara, Turkey",
    linkedin: "https://www.linkedin.com/in/abdallah-ghordlo",
    github: "https://github.com/AbdGhordlo",
  },
  {
    name: "Ahmet Tokgöz",
    role: "Computer Engineering Student",
    image: PictureAhmet,
    description: "Senior Computer Engineering Student at TED University, with a secondary field in Applied Data Analytics. Also studying Business Administration at Istanbul University (Open Education).",
    status: "Student at TED University",
    location: "Ankara, Turkey",
    linkedin: "https://tr.linkedin.com/in/ahmet-tokg%C3%B6z-960a1a264",
    github: "https://github.com/ahmettkgz",
  },
  {
    name: "Basme Zantout",
    role: "Software Engineering Student",
    image: PictureBasme,
    description: "Senior Software Engineering Student at TED University, with a secondary field in Applied Data Analytics. Passionate about building user-friendly digital experiences. Enjoys blending creativity with technology to solve real-world problems.",
    status: "Student at TED University",
    location: "Ankara, Turkey",
    linkedin: "https://www.linkedin.com/in/basme-zantout/",
    github: "https://github.com/bmzantout",
  },
  {
    name: "Hussein Abdikarim",
    role: "Computer Engineering Student",
    image: PictureHussein,
    description: "Senior Computer Engineering Student at TED University, with a secondary field in Applied Data Analytics. Passionate about using technology to make health journeys more intuitive, personalized, and sustainable.",
    status: "Student at TED University",
    location: "Ankara, Turkey",
    linkedin: "https://www.linkedin.com/in/hussein-abdikarim/",
    github: "https://github.com/Husseinabdikarim",
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
              <a href="https://www.tedu.edu.tr/en" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-green-700 transition-colors">{creator.status}</a>
            </div>
            <div className="flex items-center text-gray-500">
              <MapPin className="w-4 h-4 mr-2 text-green-500" />
              <a href="https://www.google.com/search?q=ankara+turkey&oq=ankara+turkey&gs_lcrp=EgRlZGdlKgcIABAAGIAEMgcIABAAGIAEMgcIARAAGIAEMgcIAhAAGIAEMg0IAxAAGJECGIAEGIoFMgcIBBAAGIAEMgcIBRAAGIAEMgcIBhAAGIAEMgcIBxAAGIAE0gEINDA3MWowajSoAgCwAgA&sourceid=chrome&ie=UTF-8" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-green-700 transition-colors">{creator.location}</a>
            </div>
          </div>
          <div className="flex justify-center space-x-3 mt-6 pt-4 border-t border-gray-100">
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
