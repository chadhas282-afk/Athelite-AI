import { useState, useEffect } from 'react';
import { BookOpen, Trophy, Map, Save } from 'lucide-react';

export default function ProfileForm({ profile, onSaveProfile }) {
  const [formData, setFormData] = useState({
    academics: {
      course: '',
      startTime: '',
      endTime: '',
    },
    sports: {
      sportName: '',
      trainingStart: '',
      trainingEnd: '',
      days: '',
    },
    logistics: {
      homeToSchool: '',
      schoolToAcademy: '',
      academyToHome: '',
      }
  });

  useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  const handleChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveProfile(formData);