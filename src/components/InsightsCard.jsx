import { Sparkles, TrendingUp } from 'lucide-react';

export default function InsightsCard({ insights }) {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-dark-surface to-dark-base border border-dark-border rounded-2xl p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-electric-blue/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="flex items-center gap-3 mb-5 relative z-10">
        <div className="p-2 bg-electric-blue/20 rounded-lg text-electric-blue">
          <Sparkles className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-white">AI Coach Insights</h3>
      </div>

      <ul className="space-y-4 relative z-10">
        {insights.map((insight, idx) => (
          <li key={idx} className="flex gap-4 p-4 rounded-xl bg-dark-surface/50 border border-dark-border/50 hover:bg-dark-surface transition-colors group">
            <div className="flex-shrink-0 mt-1 text-electric-blue group-hover:text-neon-green transition-colors">
              <TrendingUp className="w-4 h-4" />
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              {insight}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
