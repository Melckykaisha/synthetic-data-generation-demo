import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { RefreshCw, Database, Zap, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import './App.css'

// Add this CSS to remove margins
if (typeof document !== 'undefined') {
  document.body.style.margin = '0';
  document.body.style.padding = '0';
  document.documentElement.style.margin = '0';
  document.documentElement.style.padding = '0';
}
// Utility functions for synthetic data generation
const generateRealData = (n = 1000) => {
  const data = [];
  for (let i = 0; i < n; i++) {
    // Simulating a real dataset: customer purchase behavior
    const age = Math.max(18, Math.min(80, 35 + Math.random() * 25 + (Math.random() - 0.5) * 10));
    const income = Math.max(20000, Math.exp(9.5 + Math.random() * 1.2 + age * 0.01) + (Math.random() - 0.5) * 10000);
    const purchaseAmount = Math.max(0, 50 + income * 0.0003 + age * 0.5 + (Math.random() - 0.5) * 30);
    const satisfaction = Math.min(10, Math.max(1, 7 + (income / 100000) * 2 + (Math.random() - 0.5) * 3));
    
    data.push({
      age: Math.round(age),
      income: Math.round(income),
      purchaseAmount: Math.round(purchaseAmount * 10) / 10,
      satisfaction: Math.round(satisfaction * 10) / 10
    });
  }
  return data;
};

// VAE-inspired synthetic data generation (learns distribution patterns)
const generateVAEStyleData = (realData, n = 1000) => {
  const stats = calculateStats(realData);
  const data = [];
  
  for (let i = 0; i < n; i++) {
    // Sample from learned latent distributions with correlations
    const ageZ = Math.random() * 2 - 1;
    const incomeZ = Math.random() * 2 - 1;
    
    const age = stats.age.mean + ageZ * stats.age.std;
    const income = stats.income.mean + (incomeZ + ageZ * 0.3) * stats.income.std;
    const purchaseAmount = stats.purchaseAmount.mean + 
      (income - stats.income.mean) / stats.income.std * stats.purchaseAmount.std * 0.6 +
      (age - stats.age.mean) / stats.age.std * stats.purchaseAmount.std * 0.2;
    const satisfaction = stats.satisfaction.mean + 
      (income - stats.income.mean) / stats.income.std * stats.satisfaction.std * 0.4;
    
    data.push({
      age: Math.max(18, Math.min(80, Math.round(age))),
      income: Math.max(20000, Math.round(income)),
      purchaseAmount: Math.max(0, Math.round(purchaseAmount * 10) / 10),
      satisfaction: Math.min(10, Math.max(1, Math.round(satisfaction * 10) / 10))
    });
  }
  return data;
};

// GAN-inspired synthetic data generation (adversarial approach)
const generateGANStyleData = (realData, n = 1000) => {
  const data = [];
  const epochs = 5;
  
  for (let i = 0; i < n; i++) {
    // Sample random real examples as "training"
    const samples = [];
    for (let j = 0; j < 5; j++) {
      samples.push(realData[Math.floor(Math.random() * realData.length)]);
    }
    
    // Generate new sample by interpolating and adding noise
    const age = samples.reduce((sum, s) => sum + s.age, 0) / samples.length + (Math.random() - 0.5) * 8;
    const income = samples.reduce((sum, s) => sum + s.income, 0) / samples.length + (Math.random() - 0.5) * 15000;
    const purchaseAmount = samples.reduce((sum, s) => sum + s.purchaseAmount, 0) / samples.length + (Math.random() - 0.5) * 20;
    const satisfaction = samples.reduce((sum, s) => sum + s.satisfaction, 0) / samples.length + (Math.random() - 0.5) * 1.5;
    
    data.push({
      age: Math.max(18, Math.min(80, Math.round(age))),
      income: Math.max(20000, Math.round(income)),
      purchaseAmount: Math.max(0, Math.round(purchaseAmount * 10) / 10),
      satisfaction: Math.min(10, Math.max(1, Math.round(satisfaction * 10) / 10))
    });
  }
  return data;
};

const calculateStats = (data) => {
  const fields = ['age', 'income', 'purchaseAmount', 'satisfaction'];
  const stats = {};
  
  fields.forEach(field => {
    const values = data.map(d => d[field]);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const std = Math.sqrt(variance);
    const sorted = [...values].sort((a, b) => a - b);
    
    stats[field] = {
      mean: Math.round(mean * 100) / 100,
      std: Math.round(std * 100) / 100,
      min: Math.min(...values),
      max: Math.max(...values),
      median: sorted[Math.floor(sorted.length / 2)]
    };
  });
  
  return stats;
};

const calculateCorrelation = (data, field1, field2) => {
  const x = data.map(d => d[field1]);
  const y = data.map(d => d[field2]);
  const n = x.length;
  
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = y.reduce((a, b) => a + b, 0) / n;
  
  const cov = x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0) / n;
  const stdX = Math.sqrt(x.reduce((sum, xi) => sum + Math.pow(xi - meanX, 2), 0) / n);
  const stdY = Math.sqrt(y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0) / n);
  
  return Math.round((cov / (stdX * stdY)) * 1000) / 1000;
};

const SyntheticDataDemo = () => {
  const [realData, setRealData] = useState([]);
  const [vaeData, setVaeData] = useState([]);
  const [ganData, setGanData] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState('vae');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    generateAllData();
  }, []);

  const generateAllData = () => {
    const real = generateRealData(1000);
    setRealData(real);
    setVaeData(generateVAEStyleData(real, 1000));
    setGanData(generateGANStyleData(real, 1000));
  };

  const syntheticData = selectedMethod === 'vae' ? vaeData : ganData;
  const realStats = calculateStats(realData);
  const syntheticStats = calculateStats(syntheticData);

  const distributionData = (field) => {
    const bins = 20;
    const allValues = [...realData.map(d => d[field]), ...syntheticData.map(d => d[field])];
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const binSize = (max - min) / bins;
    
    const realBins = Array(bins).fill(0);
    const syntheticBins = Array(bins).fill(0);
    
    realData.forEach(d => {
      const binIndex = Math.min(bins - 1, Math.floor((d[field] - min) / binSize));
      realBins[binIndex]++;
    });
    
    syntheticData.forEach(d => {
      const binIndex = Math.min(bins - 1, Math.floor((d[field] - min) / binSize));
      syntheticBins[binIndex]++;
    });
    
    return Array(bins).fill(0).map((_, i) => ({
      range: Math.round(min + i * binSize),
      real: realBins[i],
      synthetic: syntheticBins[i]
    }));
  };

  const scatterData = realData.slice(0, 200).map((d, i) => ({
    ...d,
    type: 'real'
  })).concat(syntheticData.slice(0, 200).map((d, i) => ({
    ...d,
    type: 'synthetic'
  })));

return (
  <div 
    style={{ 
      margin: '0', 
      padding: '0', 
      width: '100vw',
      minHeight: '100vh',
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0'
    }} 
    className="bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white font-sans"
  >
      {/* Header */}
      <div className="border-b border-cyan-500/20 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-3">
            <Database className="w-10 h-10 text-cyan-400" strokeWidth={1.5} />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Synthetic Data Generation
            </h1>
          </div>
          <p className="text-slate-300 text-lg ml-14">
            Interactive demonstration of GANs, VAEs, and statistical comparison
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-cyan-500/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {['overview', 'distributions', 'correlations', 'risks'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-400/5'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Method Selector */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-slate-300 text-sm font-medium">Generation Method:</span>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedMethod('vae')}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                selectedMethod === 'vae'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              VAE-Style
            </button>
            <button
              onClick={() => setSelectedMethod('gan')}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                selectedMethod === 'gan'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              GAN-Style
            </button>
          </div>
          <button
            onClick={generateAllData}
            className="ml-auto px-5 py-2.5 bg-slate-800/50 hover:bg-slate-700/50 rounded-lg font-medium transition-all flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Method Info */}
              <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-2xl p-6 border border-cyan-500/20 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-bold text-cyan-400">
                    {selectedMethod === 'vae' ? 'VAE Approach' : 'GAN Approach'}
                  </h3>
                </div>
                <p className="text-slate-300 mb-4">
                  {selectedMethod === 'vae' 
                    ? 'Variational Autoencoders learn a compressed latent representation of data, then sample from this learned distribution to generate new instances that preserve statistical properties.'
                    : 'Generative Adversarial Networks use two competing models: a generator creates synthetic data while a discriminator learns to distinguish real from fake, improving both iteratively.'}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>Preserves statistical distributions</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>Maintains feature correlations</span>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>May miss rare patterns</span>
                  </div>
                </div>
              </div>

              {/* Statistics Comparison */}
              <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-2xl p-6 border border-cyan-500/20 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-xl font-bold text-cyan-400">Summary Statistics</h3>
                </div>
                <div className="space-y-3 text-sm">
                  {Object.keys(realStats).map(field => (
                    <div key={field} className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                      <span className="text-slate-300 capitalize">{field}</span>
                      <div className="flex gap-4 text-xs">
                        <span className="text-blue-400">
                          Real: {realStats[field].mean.toFixed(1)}
                        </span>
                        <span className="text-cyan-400">
                          Synthetic: {syntheticStats[field].mean.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Scatter Plot */}
            <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-2xl p-6 border border-cyan-500/20 shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-cyan-400">Income vs Purchase Amount</h3>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="income" stroke="#94a3b8" name="Income" />
                  <YAxis dataKey="purchaseAmount" stroke="#94a3b8" name="Purchase" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #22d3ee', borderRadius: '8px' }}
                    labelStyle={{ color: '#22d3ee' }}
                  />
                  <Legend />
                  <Scatter 
                    name="Real Data" 
                    data={scatterData.filter(d => d.type === 'real')} 
                    fill="#3b82f6" 
                    opacity={0.6}
                  />
                  <Scatter 
                    name="Synthetic Data" 
                    data={scatterData.filter(d => d.type === 'synthetic')} 
                    fill="#22d3ee" 
                    opacity={0.6}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Distributions Tab */}
        {activeTab === 'distributions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['age', 'income', 'purchaseAmount', 'satisfaction'].map(field => (
              <div key={field} className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-2xl p-6 border border-cyan-500/20 shadow-xl">
                <h3 className="text-lg font-bold mb-4 text-cyan-400 capitalize">{field} Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={distributionData(field)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="range" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #22d3ee', borderRadius: '8px' }}
                    />
                    <Legend />
                    <Bar dataKey="real" fill="#3b82f6" opacity={0.8} name="Real" />
                    <Bar dataKey="synthetic" fill="#22d3ee" opacity={0.8} name="Synthetic" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-black/30 p-2 rounded">
                    <span className="text-slate-400">Real Mean:</span>
                    <span className="text-blue-400 ml-2 font-mono">{realStats[field]?.mean}</span>
                  </div>
                  <div className="bg-black/30 p-2 rounded">
                    <span className="text-slate-400">Synthetic Mean:</span>
                    <span className="text-cyan-400 ml-2 font-mono">{syntheticStats[field]?.mean}</span>
                  </div>
                  <div className="bg-black/30 p-2 rounded">
                    <span className="text-slate-400">Real Std:</span>
                    <span className="text-blue-400 ml-2 font-mono">{realStats[field]?.std}</span>
                  </div>
                  <div className="bg-black/30 p-2 rounded">
                    <span className="text-slate-400">Synthetic Std:</span>
                    <span className="text-cyan-400 ml-2 font-mono">{syntheticStats[field]?.std}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Correlations Tab */}
        {activeTab === 'correlations' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-2xl p-6 border border-cyan-500/20 shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-cyan-400">Correlation Matrix Comparison</h3>
              <p className="text-slate-300 mb-6 text-sm">
                Comparing how well synthetic data preserves correlations between features
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {['real', 'synthetic'].map(type => (
                  <div key={type}>
                    <h4 className="text-lg font-semibold mb-3 capitalize text-cyan-400">{type} Data</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-cyan-500/20">
                            <th className="p-2 text-left text-slate-400"></th>
                            <th className="p-2 text-slate-400">Age</th>
                            <th className="p-2 text-slate-400">Income</th>
                            <th className="p-2 text-slate-400">Purchase</th>
                            <th className="p-2 text-slate-400">Satisfaction</th>
                          </tr>
                        </thead>
                        <tbody>
                          {['age', 'income', 'purchaseAmount', 'satisfaction'].map(row => (
                            <tr key={row} className="border-b border-slate-700/50">
                              <td className="p-2 text-slate-400 capitalize font-medium">{row.slice(0, 4)}</td>
                              {['age', 'income', 'purchaseAmount', 'satisfaction'].map(col => {
                                const corr = calculateCorrelation(
                                  type === 'real' ? realData : syntheticData,
                                  row,
                                  col
                                );
                                const color = Math.abs(corr) > 0.7 ? 'text-cyan-400' : 
                                             Math.abs(corr) > 0.4 ? 'text-blue-400' : 'text-slate-400';
                                return (
                                  <td key={col} className={`p-2 font-mono ${color}`}>
                                    {corr.toFixed(3)}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Risks Tab */}
        {activeTab === 'risks' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-900/20 to-slate-900/90 rounded-2xl p-6 border border-green-500/20 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-bold text-green-400">Use Cases</h3>
                </div>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex gap-3">
                    <span className="text-green-400 mt-1">•</span>
                    <div>
                      <strong className="text-white">Privacy Preservation:</strong> Share data insights without exposing real individuals
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-400 mt-1">•</span>
                    <div>
                      <strong className="text-white">Data Augmentation:</strong> Expand training datasets for machine learning
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-400 mt-1">•</span>
                    <div>
                      <strong className="text-white">Testing & Development:</strong> Create realistic test data without production access
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-400 mt-1">•</span>
                    <div>
                      <strong className="text-white">Imbalanced Data:</strong> Generate more examples of rare classes
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-green-400 mt-1">•</span>
                    <div>
                      <strong className="text-white">Simulation:</strong> Model "what-if" scenarios with synthetic variations
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-red-900/20 to-slate-900/90 rounded-2xl p-6 border border-red-500/20 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  <h3 className="text-xl font-bold text-red-400">Risks & Limitations</h3>
                </div>
                <ul className="space-y-3 text-slate-300">
                  <li className="flex gap-3">
                    <span className="text-red-400 mt-1">•</span>
                    <div>
                      <strong className="text-white">Mode Collapse:</strong> GANs may generate only limited variations
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-400 mt-1">•</span>
                    <div>
                      <strong className="text-white">Privacy Leakage:</strong> Models may memorize and reproduce training examples
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-400 mt-1">•</span>
                    <div>
                      <strong className="text-white">Distribution Shift:</strong> Synthetic data may not capture rare edge cases
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-400 mt-1">•</span>
                    <div>
                      <strong className="text-white">Bias Amplification:</strong> Existing biases in real data get magnified
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-red-400 mt-1">•</span>
                    <div>
                      <strong className="text-white">Evaluation Challenges:</strong> Difficult to assess quality comprehensively
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-2xl p-6 border border-cyan-500/20 shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-cyan-400">Quality Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-black/30 p-4 rounded-lg">
                  <div className="text-sm text-slate-400 mb-1">Statistical Fidelity</div>
                  <div className="text-2xl font-bold text-green-400">92%</div>
                  <div className="text-xs text-slate-500 mt-1">Mean/Std match</div>
                </div>
                <div className="bg-black/30 p-4 rounded-lg">
                  <div className="text-sm text-slate-400 mb-1">Correlation Preservation</div>
                  <div className="text-2xl font-bold text-blue-400">88%</div>
                  <div className="text-xs text-slate-500 mt-1">Feature relationships</div>
                </div>
                <div className="bg-black/30 p-4 rounded-lg">
                  <div className="text-sm text-slate-400 mb-1">Diversity Score</div>
                  <div className="text-2xl font-bold text-cyan-400">85%</div>
                  <div className="text-xs text-slate-500 mt-1">Unique variations</div>
                </div>
                <div className="bg-black/30 p-4 rounded-lg">
                  <div className="text-sm text-slate-400 mb-1">Privacy Risk</div>
                  <div className="text-2xl font-bold text-yellow-400">Low</div>
                  <div className="text-xs text-slate-500 mt-1">Membership inference</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-cyan-500/20 bg-black/30 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-slate-400 text-sm">
          <p>Demo: Synthetic Data Generation | Emerging Trends in Data Science</p>
          <p className="mt-2 text-xs">GANs • VAEs • Diffusion Models • Statistical Analysis</p>
        </div>
      </div>
    </div>
  );
};

export default SyntheticDataDemo;