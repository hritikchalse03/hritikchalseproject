import { Search, Bell, User, TrendingUp } from 'lucide-react';

const Header = ({ onSearch, searchTerm }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo and Navigation */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">Quartr</h1>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-700 hover:text-primary-600 font-medium">Dashboard</a>
            <a href="#" className="text-gray-700 hover:text-primary-600 font-medium">Analytics</a>
            <a href="#" className="text-gray-700 hover:text-primary-600 font-medium">Transcripts</a>
            <a href="#" className="text-gray-700 hover:text-primary-600 font-medium">Calendar</a>
            <a href="#" className="text-gray-700 hover:text-primary-600 font-medium">Insights</a>
          </nav>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies, symbols..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Bell className="h-5 w-5" />
          </button>
          
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;