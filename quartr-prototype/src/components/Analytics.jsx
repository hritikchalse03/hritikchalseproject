import { useState } from 'react';
import { FileText, MessageSquare, TrendingUp, Brain, Filter, Calendar, Play } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { recentTranscripts, aiInsights, companies } from '../data/sampleData';

const TranscriptCard = ({ transcript }) => (
  <div className="card hover:shadow-md transition-shadow cursor-pointer">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-primary-100 rounded-lg">
          <FileText className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{transcript.company}</h3>
          <p className="text-sm text-gray-600">{transcript.type} • {transcript.quarter}</p>
          <p className="text-xs text-gray-500">{transcript.date}</p>
        </div>
      </div>
      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
        transcript.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
        transcript.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
        'bg-yellow-100 text-yellow-800'
      }`}>
        {transcript.sentiment}
      </div>
    </div>
    
    <div className="mb-3">
      <p className="text-sm font-medium text-gray-700 mb-2">Key Topics:</p>
      <div className="flex flex-wrap gap-2">
        {transcript.keyTopics.map((topic, i) => (
          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
            {topic}
          </span>
        ))}
      </div>
    </div>
    
    <div>
      <p className="text-sm font-medium text-gray-700 mb-2">Key Highlights:</p>
      <ul className="text-sm text-gray-600 space-y-1">
        {transcript.highlights.map((highlight, i) => (
          <li key={i} className="flex items-start">
            <span className="text-primary-600 mr-2">•</span>
            {highlight}
          </li>
        ))}
      </ul>
    </div>
    
    <div className="mt-4 flex items-center justify-between">
      <button className="btn-secondary text-sm">
        <Play className="h-4 w-4 mr-1" />
        Listen
      </button>
      <button className="btn-primary text-sm">
        View Full Transcript
      </button>
    </div>
  </div>
);

const InsightCard = ({ insight }) => (
  <div className="card">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Brain className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{insight.title}</h3>
          <p className="text-sm text-gray-600">{insight.category}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium text-gray-900">{insight.confidence}%</div>
        <div className="text-xs text-gray-500">confidence</div>
      </div>
    </div>
    
    <p className="text-sm text-gray-700 mb-3">{insight.summary}</p>
    
    <div className="flex items-center justify-between text-xs text-gray-500">
      <span>{insight.date}</span>
      <button className="text-primary-600 hover:text-primary-700">View Details</button>
    </div>
  </div>
);

const Analytics = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');
  
  // Sample data for charts
  const earningsData = companies.map(company => ({
    symbol: company.symbol,
    q1: company.earnings.q1,
    q2: company.earnings.q2,
    q3: company.earnings.q3,
    q4: company.earnings.q4
  }));

  const sentimentData = [
    { name: 'Positive', value: 73, color: '#10B981' },
    { name: 'Neutral', value: 18, color: '#F59E0B' },
    { name: 'Negative', value: 9, color: '#EF4444' }
  ];

  const topicTrends = [
    { topic: 'AI Integration', mentions: 347, change: 23 },
    { topic: 'Cloud Services', mentions: 289, change: 15 },
    { topic: 'Supply Chain', mentions: 156, change: -8 },
    { topic: 'Sustainability', mentions: 134, change: 31 },
    { topic: 'Market Expansion', mentions: 98, change: 12 }
  ];

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive analysis of earnings calls, transcripts, and market insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select 
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Companies</option>
              <option value="technology">Technology</option>
              <option value="healthcare">Healthcare</option>
              <option value="financial">Financial</option>
            </select>
          </div>
          <div className="flex space-x-2">
            {['1W', '1M', '3M', '1Y'].map((timeframe) => (
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
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Transcripts</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
              <p className="text-sm text-green-600">+12% this month</p>
            </div>
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">AI Insights</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
              <p className="text-sm text-green-600">+23% this month</p>
            </div>
            <Brain className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Confidence</p>
              <p className="text-2xl font-bold text-gray-900">78%</p>
              <p className="text-sm text-green-600">+5% this month</p>
            </div>
            <TrendingUp className="h-8 w-8 text-gray-400" />
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Companies Covered</p>
              <p className="text-2xl font-bold text-gray-900">13,000+</p>
              <p className="text-sm text-gray-600">Global coverage</p>
            </div>
            <Calendar className="h-8 w-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Performance */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quarterly Earnings Performance</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={earningsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="symbol" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="q1" fill="#3B82F6" />
                <Bar dataKey="q2" fill="#10B981" />
                <Bar dataKey="q3" fill="#F59E0B" />
                <Bar dataKey="q4" fill="#EF4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Overall Market Sentiment</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Trending Topics in Earnings Calls</h2>
        <div className="space-y-4">
          {topicTrends.map((topic, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{topic.topic}</p>
                <p className="text-sm text-gray-600">{topic.mentions} mentions this quarter</p>
              </div>
              <div className={`text-right ${topic.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                <p className="font-medium">{topic.change > 0 ? '+' : ''}{topic.change}%</p>
                <p className="text-sm">vs last quarter</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transcripts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Recent Transcripts</h2>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentTranscripts.map((transcript) => (
              <TranscriptCard key={transcript.id} transcript={transcript} />
            ))}
          </div>
        </div>

        {/* AI Insights */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">AI-Generated Insights</h2>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {aiInsights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;