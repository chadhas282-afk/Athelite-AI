import { useState, useEffect } from 'react';
import Header from './components/Header';
import ProfileForm from './components/ProfileForm';
import Dashboard from './components/Dashboard';

function App() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const storedProfile = localStorage.getItem('athelite_profile');
    if (storedProfile) {
      try {
        setProfile(JSON.parse(storedProfile));
      } catch (e) {
        console.error("Failed to parse profile");
      }
    }
  }, []);

  const handleSaveProfile = (newProfile) => {