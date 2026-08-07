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