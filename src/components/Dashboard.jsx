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

    schedule.push({
      time: formatRange(tStartSchool, tEndSchool),
      activity: "📝 Academics: " + (prof.academics.course || "School/College"),
      type: "academic",
      notes: "💡 Tip: Focus 100% here so you don't have to study late night."
    });

    const tStartTransitSport = tStartSport - mToSport;
    if (tStartTransitSport > tEndSchool) {
      schedule.push({
        time: formatRange(tEndSchool, tStartTransitSport),
        activity: "🔋 Free Time / Rest",
        type: "routine",
        notes: "Take a break, grab a quick snack, and recharge before heading to training."
      });
    } else if (tStartTransitSport < tEndSchool) {
      
    }

    if (mToSport > 0) {
      schedule.push({
        time: formatRange(Math.max(tEndSchool, tStartTransitSport), tStartSport),
        activity: "🎒 Transit to Academy",
        type: "study",
        notes: `Transit time: ${mToSport} mins. Tip: Listen to a quick educational podcast or revise formulas on your phone.`
      });
    }

    schedule.push({
      time: formatRange(tStartSport, tEndSport),
      activity: `👟 Training: ${prof.sports.sportName}`,
      type: "athletic",
      notes: "🔥 Training Mode: Stay hydrated and give your 100%!"
    });

    const tArriveHome = tEndSport + mToHome;
    if (mToHome > 0) {
      schedule.push({
        time: formatRange(tEndSport, tArriveHome),
        activity: "🚌 Transit to Home",
        type: "transit",
        notes: "Cool down mentally. Hydrate and review your training."
      });
    }

    const tEndDinner = tArriveHome + 60; 
    schedule.push({
      time: formatRange(tArriveHome, tEndDinner),
      activity: "🥗 Recovery & Dinner",
      type: "recovery",
      notes: "Consume a high-protein meal to help with muscle recovery after training."
    });

    const tEndStudy = tEndDinner + 90; 
    schedule.push({
      time: formatRange(tEndDinner, tEndStudy),
      activity: "📚 High-Focus Study Session",
      type: "study",
      notes: "Dedicated 1.5-hour block. Put your phone away and focus on deep work."
    });

    const tSleepStart = tWakeUp - (8 * 60); 
    let tSleepStartAdjusted = tSleepStart;
    if (tSleepStartAdjusted < 0) tSleepStartAdjusted += 24 * 60;

    if (tEndStudy < tSleepStartAdjusted || (tEndStudy > tSleepStartAdjusted && tEndStudy < 24*60 && tSleepStartAdjusted < 12*60)) {
        schedule.push({
            time: formatRange(tEndStudy, tSleepStartAdjusted > tEndStudy ? tSleepStartAdjusted : tSleepStartAdjusted + 24*60),
            activity: "🧘 Wind Down",