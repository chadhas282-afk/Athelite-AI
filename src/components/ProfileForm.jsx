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