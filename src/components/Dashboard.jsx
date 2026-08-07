import { useState } from 'react';
import { Zap, AlertCircle } from 'lucide-react';
import ScheduleView from './ScheduleView';
import InsightsCard from './InsightsCard';

function timeToMinutes(timeStr) {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(mins) {
  let h = Math.floor(mins / 60) % 24;
  let m = Math.floor(mins % 60);
  if (h < 0) h += 24;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function formatRange(startMins, endMins) {
  return `${minutesToTime(startMins)} - ${minutesToTime(endMins)}`;
}

export default function Dashboard({ profile }) {
  const [loading, setLoading] = useState(false);
  const [scheduleData, setScheduleData] = useState(null);
  const [error, setError] = useState(null);

  const generateOfflineSchedule = (prof) => {
    const tStartSchool = timeToMinutes(prof.academics.startTime);
    const tEndSchool = timeToMinutes(prof.academics.endTime);
    let tStartSport = timeToMinutes(prof.sports.trainingStart);
    let tEndSport = timeToMinutes(prof.sports.trainingEnd);
    
    if (tEndSport < tStartSport) tEndSport += 24 * 60;
    
    const mToSchool = parseInt(prof.logistics.homeToSchool) || 0;
    const mToSport = parseInt(prof.logistics.schoolToAcademy) || 0;
    const mToHome = parseInt(prof.logistics.academyToHome) || 0;

    const schedule = [];
    const insights = [];

    const tWakeUp = tStartSchool - 90;
    schedule.push({
      time: formatRange(tWakeUp, tStartSchool - mToSchool),
      activity: "🍳 Wake Up & Breakfast",
      type: "routine",
      notes: "Hydrate, eat a balanced breakfast, and prepare your gear for the day."
    });

    if (mToSchool > 0) {
      schedule.push({
        time: formatRange(tStartSchool - mToSchool, tStartSchool),
        activity: "🚌 Transit to School",
        type: "transit",
        notes: "Listen to some light music or a short podcast to wake your brain up."
      });
    }