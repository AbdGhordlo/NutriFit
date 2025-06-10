import React from "react";
import { PersonalInfo } from "../../types/personalization";
import { Slider } from "../Slider";

interface Step1Props {
  personalInfo: PersonalInfo;
  setPersonalInfo: (info: PersonalInfo) => void;
}

export const Step1 = ({ personalInfo, setPersonalInfo }: Step1Props) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-dark-green mb-6">Basic Information</h2>
    <Slider
      label="Height"
      value={personalInfo.height}
      onChange={(value) => setPersonalInfo({ ...personalInfo, height: value })}
      min={130}
      max={250}
      unit="cm"
    />
    <Slider
      label="Weight"
      value={personalInfo.weight}
      onChange={(value) => setPersonalInfo({ ...personalInfo, weight: value })}
      min={30}
      max={230}
      unit="kg"
    />
    <Slider
      label="Age"
      value={personalInfo.age}
      onChange={(value) => setPersonalInfo({ ...personalInfo, age: value })}
      min={15}
      max={100}
      unit=""
    />
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
      <div className="flex gap-4">
        {["male", "female"].map((gender) => (
          <button
            key={gender}
            onClick={() =>
              setPersonalInfo({
                ...personalInfo,
                gender: gender as "male" | "female",
              })
            }
            className={`flex-1 py-2 px-4 rounded-lg border ${
              personalInfo.gender === gender
                ? "bg-primary-green text-white border-primary-green"
                : "border-gray-300 hover:border-primary-green"
            }`}
          >
            {gender.charAt(0).toUpperCase() + gender.slice(1)}
          </button>
        ))}
      </div>
    </div>
  </div>
);