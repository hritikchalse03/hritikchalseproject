import { useState } from 'react';
import { TrendingUp, TrendingDown, Calendar, FileText, Brain, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { companies, marketIndices, sectorPerformance, earningsCalendar, chartData } from '../data/sampleData';

const MetricCard = ({ title, value, change, changePercent, icon: Icon, trend }) => (
  <div className="card">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <div className={`flex items-center mt-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
          <span className="text-sm font-medium">
            {change > 0 ? '+' : ''}{change} ({changePercent > 0 ? '+' : ''}{changePercent}%)
          </span>
        </div>
      </div>
      <Icon className="h-8 w-8 text-gray-400" />
    </div>
  </div>
);

const CompanyCard = ({ company }) => (
  <div className="card hover:shadow-md transition-shadow cursor-pointer">
    <div className="flex items-center justify-between mb-3">
      <div>
        <h3 className="font-bold text-lg text-gray-900">{company.symbol}</h3>
        <p className="text-sm text-gray-600">{company.name}</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold text-gray-900">${company.price.toFixed(2)}</p>
        <div className={`flex items-center ${company.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {company.change > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
          <span className="text-sm font-medium">
            {company.change > 0 ? '+' : ''}{company.change.toFixed(2)} ({company.changePercent > 0 ? '+' : ''}{company.changePercent.toFixed(2)}%)
          </span>
        </div>
      </div>
    </div>
    
    <div className="grid grid-cols-3 gap-4 text-sm">
      <div>
        <p className="text-gray-600">P/E Ratio</p>
        <p className="font-medium">{company.pe}</p>
      </div>
      <div>
        <p className="text-gray-600">Volume</p>
        <p className="font-medium">{(company.volume / 1000000).toFixed(1)}M</p>
      </div>
      <div>
        <p className="text-gray-600">Market Cap</p>
        <p className="font-medium">${(company.marketCap / 1000000000).toFixed(1)}B</p>
      </div>
    </div>
  </div>
);

const Dashboard = ({ searchTerm }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1W');
  
  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {marketIndices.map((index, i) => (
          <MetricCard
            key={i}
            title={index.name}
            value={index.value.toLocaleString()}
            change={index.change.toFixed(2)}
            changePercent={index.changePercent.toFixed(2)}
            icon={BarChart3}
            trend={index.change > 0 ? 'up' : 'down'}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock Price Chart */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Market Performance</h2>
            <div className="flex space-x-2">
              {['1D', '1W', '1M', '3M', '1Y'].map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={`px-3 py-1 text-sm rounded ${
                    selectedTimeframe === timeframe
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.stockPrices}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="AAPL" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="MSFT" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="GOOGL" stroke="#F59E0B" strokeWidth={2} />
                <Line type="monotone" dataKey="TSLA" stroke="#EF4444" strokeWidth={2} />
                <Line type="monotone" dataKey="NVDA" stroke="#8B5CF6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Performance */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Sector Performance</h2>
          <div className="space-y-3">
            {sectorPerformance.map((sector, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{sector.sector}</p>
                  <p className="text-sm text-gray-600">{sector.companies} companies</p>
                </div>
                <div className={`text-right ${sector.performance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <p className="font-medium">{sector.performance > 0 ? '+' : ''}{sector.performance.toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Watchlist */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Watchlist</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {filteredCompanies.length} of {companies.length} companies
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.slice(0, 6).map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </div>

      {/* Earnings Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center mb-4">
            <Calendar className="h-5 w-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-bold text-gray-900">Upcoming Earnings</h2>
          </div>
          <div className="space-y-3">
            {earningsCalendar.map((earning, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{earning.symbol}</p>
                  <p className="text-sm text-gray-600">{earning.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{earning.date}</p>
                  <p className="text-sm text-gray-600">{earning.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="card">
          <div className="flex items-center mb-4">
            <Brain className="h-5 w-5 text-primary-600 mr-2" />
            <h2 className="text-lg font-bold text-gray-900">Market Insights</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900">AI-Powered Analysis</h3>
              <p className="text-sm text-blue-700 mt-1">
                Technology sector showing strong momentum with 85% confidence based on earnings transcripts analysis.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-green-900">Trending Topics</h3>
              <p className="text-sm text-green-700 mt-1">
                "AI Integration" mentioned 347 times across recent earnings calls, up 23% from last quarter.
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-yellow-900">Market Sentiment</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Overall positive sentiment detected in 73% of recent transcripts, indicating bullish outlook.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;