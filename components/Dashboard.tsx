import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Search, Info, TrendingUp, AlertTriangle } from 'lucide-react';
import { WASTE_CATEGORIES, GLOBAL_WASTE_STATS } from '../constants';

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter categories based on search
  const filteredCategories = WASTE_CATEGORIES.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.toLowerCase().includes(searchTerm.toLowerCase()) || 
      cat.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Global Waste Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-pink-600" />
            Current Wastage Ratio on Earth
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={GLOBAL_WASTE_STATS}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {GLOBAL_WASTE_STATS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-slate-500 text-center">
            Global annual waste generation is expected to jump to 3.4 billion tonnes over the next 30 years.
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg p-6 text-white flex flex-col justify-center">
          <div className="flex items-start mb-4">
            <div className="p-3 bg-white/10 rounded-xl mr-4">
              <Info className="w-8 h-8 text-pink-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Smart City Initiative</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Our database contains over 40,000+ waste material signatures powered by deep learning.
                Use the detector to identify, classify, and learn how to recycle materials properly to
                contribute to a greener planet.
              </p>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 mt-auto border border-white/10">
            <div className="flex items-center text-amber-400 mb-2">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <span className="font-semibold">Urgent Attention</span>
            </div>
            <p className="text-xs text-slate-400">
              Plastic pollution has increased by 50% in the last decade. Please separate organic and inorganic waste responsibly.
            </p>
          </div>
        </div>
      </div>

      {/* Database Search Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-bold text-slate-800">Waste Material Database</h2>
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-shadow"
              placeholder="Search waste materials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
                <h3 className="font-semibold text-slate-700 truncate" title={category.title}>
                  {category.title}
                </h3>
              </div>
              <div className="p-4 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500">No waste materials found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;