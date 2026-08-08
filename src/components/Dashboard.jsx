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
            type: "routine",
            notes: "Screen-free time. Read a book, stretch, and relax."
        });
    }

    schedule.push({
      time: formatRange(tSleepStartAdjusted, tWakeUp < tSleepStartAdjusted ? tWakeUp + 24*60 : tWakeUp),
      activity: "💤 Sleep (8 Hours)",
      type: "routine",
      notes: `Aim for 8 hours of sleep to recover fully for tomorrow.`
    });

    insights.push(`Sleep Optimization: Going to bed by ${minutesToTime(tSleepStart)} ensures you get a full 8 hours of rest before waking up at ${minutesToTime(tWakeUp)}.`);
    insights.push(`Nutrition Timing: Your high-protein dinner is scheduled at ${minutesToTime(tArriveHome)}, perfectly timed post-training.`);
    if (mToSport > 0) {
        insights.push(`Micro-Learning: You can accumulate over ${(mToSport * 5) / 60} hours of extra study time per week just during your transit to training!`);
    }

    return { schedule, insights };
  };

  const generateSchedule = () => {
    if (!profile || !profile.academics.startTime || !profile.sports.trainingStart) {
      setError("Please fill out your profile completely (including times) and save first.");
      return;
    }
    setError(null);
    setLoading(true);

    setTimeout(() => {
      try {
        const data = generateOfflineSchedule(profile);
        setScheduleData(data);
      } catch (err) {
        setError("An error occurred while generating the schedule.");
      } finally {
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-surface p-6 rounded-2xl border border-dark-border shadow-lg">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Your Dashboard</h2>
          <p className="text-gray-400 text-sm">Smart offline scheduling based on your inputs.</p>
        </div>
        <button
          onClick={generateSchedule}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-neon-green hover:bg-[#32e011] text-black font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_25px_rgba(57,255,20,0.5)] disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Zap className={`w-5 h-5 ${loading ? 'animate-pulse' : ''}`} />
          {loading ? 'Generating...' : 'Generate Smart Schedule'}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {loading && (
        <div className="space-y-6 animate-pulse">
          <div className="h-64 bg-dark-surface rounded-2xl border border-dark-border"></div>
          <div className="h-40 bg-dark-surface rounded-2xl border border-dark-border"></div>
        </div>
      )}

      {!loading && scheduleData && (
        <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ScheduleView schedule={scheduleData.schedule} />
          <InsightsCard insights={scheduleData.insights} />
        </div>
      )}

      {!loading && !scheduleData && !error && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 border border-dashed border-dark-border rounded-2xl bg-dark-surface/50">
          <Zap className="w-12 h-12 text-gray-500 mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-gray-300">Ready to Optimize</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-sm">
            Fill in your profile details and hit the generate button to create your personalized offline athletic schedule.
          </p>
        </div>
      )}
    </div>
  );
}
