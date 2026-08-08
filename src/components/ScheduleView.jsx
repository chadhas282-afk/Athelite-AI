import { BookOpen, Trophy, Map, HeartPulse, BrainCircuit, Coffee, Clock } from 'lucide-react';

const getTypeConfig = (type) => {
  switch (type.toLowerCase()) {
    case 'academic': return { icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' };
    case 'athletic': return { icon: Trophy, color: 'text-neon-green', bg: 'bg-neon-green/10', border: 'border-neon-green/20' };
    case 'transit': return { icon: Map, color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20' };
    case 'recovery': return { icon: HeartPulse, color: 'text-pink-400', bg: 'bg-pink-400/10', border: 'border-pink-400/20' };
    case 'study': return { icon: BrainCircuit, color: 'text-electric-blue', bg: 'bg-electric-blue/10', border: 'border-electric-blue/20' };
    case 'routine':
    default:
      return { icon: Coffee, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' };
  }
};

export default function ScheduleView({ schedule }) {
  if (!schedule || schedule.length === 0) return null;

  return (
    <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6 text-white" />
        <h3 className="text-xl font-bold text-white">Daily Timetable</h3>
      </div>

      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-dark-border before:to-transparent">
        {schedule.map((item, idx) => {
          const { icon: Icon, color, bg, border } = getTypeConfig(item.type);
          
          return (
            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-dark-base ${bg} ${color} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10`}>
                <Icon className="w-4 h-4" />
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-dark-border bg-dark-base shadow-sm hover:border-gray-500 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider ${bg} ${color} ${border} border`}>
                    {item.type}
                  </span>
                  <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">{item.activity}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{item.notes}</p>
              </div>
              
            </div>
          );
        })}
      </div>
    </div>
  );
}
