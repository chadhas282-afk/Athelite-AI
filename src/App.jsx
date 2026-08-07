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
        setProfile(newProfile);
    localStorage.setItem('athelite_profile', JSON.stringify(newProfile));
  };

  return (
    <div className="min-h-screen bg-dark-base text-white font-sans flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4">
            <ProfileForm profile={profile} onSaveProfile={handleSaveProfile} />
          </div>
          
          <div className="lg:col-span-8">
            <Dashboard profile={profile} />
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
