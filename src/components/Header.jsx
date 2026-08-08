

export default function Header() {
  return (
    <header className="border-b border-dark-border bg-dark-surface/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg border border-neon-green/20">
            <img src="/sunspark-logo.png" alt="SUNSPARK AI Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              SUNSPARK <span className="text-electric-blue">AI</span>
            </h1>
            <p className="text-xs text-gray-400 font-medium">The Ultimate Academic & Athletic Tracker</p>
          </div>
        </div>
      </div>
    </header>
  );
}
