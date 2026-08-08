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
     };

  return (
    <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Athlete Profile</h2>
        <p className="text-sm text-gray-400">Set your schedule parameters for the AI</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        <section>
          <div className="flex items-center gap-2 mb-4 text-electric-blue">
            <BookOpen className="w-5 h-5" />
            <h3 className="font-semibold text-gray-100">Academics</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Stream / Course</label>
              <input required type="text" value={formData.academics.course} onChange={e => handleChange('academics', 'course', e.target.value)} placeholder="e.g. High School Science" className="w-full bg-dark-base border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:border-electric-blue focus:ring-1 focus:ring-electric-blue outline-none" />
              </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Start Time</label>
                <input required type="time" value={formData.academics.startTime} onChange={e => handleChange('academics', 'startTime', e.target.value)} className="w-full bg-dark-base border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:border-electric-blue outline-none color-scheme-dark" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">End Time</label>
                <input required type="time" value={formData.academics.endTime} onChange={e => handleChange('academics', 'endTime', e.target.value)} className="w-full bg-dark-base border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:border-electric-blue outline-none color-scheme-dark" />
              </div>
            </div>
          </div>
        </section>


        <section>
          <div className="flex items-center gap-2 mb-4 text-neon-green">
            <Trophy className="w-5 h-5" />
            <h3 className="font-semibold text-gray-100">Athletics</h3>
          </div>