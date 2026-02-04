import { useState, useMemo } from 'react';
import { Box, Paper, Typography, IconButton, Stack } from '@mui/material';
import { ArrowBackIosNew, ArrowForwardIos, Close, Timeline } from '@mui/icons-material';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { ExchangeRecord } from '../types/types';

interface TradeChartProps {
  allData: ExchangeRecord[];
  activeCurrency: string | null;
  onClose: () => void;
}

const TradeChart: React.FC<TradeChartProps> = ({ allData, activeCurrency, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const tradePairs = useMemo(() => {
    if (!activeCurrency) return [];
    const pairs = allData
      .filter((d) => d.fromCurrency === activeCurrency)
      .map((d) => `${d.fromCurrency} ➔ ${d.toCurrency}`);
    return Array.from(new Set(pairs));
  }, [allData, activeCurrency]);

  const currentChartData = useMemo(() => {
    if (tradePairs.length === 0) return [];
    const [from, to] = tradePairs[currentIndex].split(' ➔ ');
    return allData
      .filter((d) => d.fromCurrency === from && d.toCurrency === to)
      .map((d) => ({
        // Date formatting: "14 Jan" jaisa look dene ke liye
        date: d.date.split(',')[0], 
        rate: parseFloat(d.rate.toString()),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [tradePairs, currentIndex, allData]);

  if (!activeCurrency || tradePairs.length === 0) return null;

  return (
    <Paper elevation={0} sx={{ 
      p: 3, mb: 4, borderRadius: 4, bgcolor: '#ffffff', 
      border: '1px solid #f0f0f0',
      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' 
    }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton onClick={onClose} size="small" sx={{ bgcolor: '#f8fafc', '&:hover': { bgcolor: '#fee2e2', color: '#ef4444' } }}>
            <Close fontSize="small" />
          </IconButton>
          <Box>
             <Stack direction="row" spacing={1} alignItems="center">
                <Timeline sx={{ color: '#10b981', fontSize: 22 }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>
                  {tradePairs[currentIndex]}
                </Typography>
             </Stack>
             <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>Market Trend Analysis</Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ bgcolor: '#f1f5f9', p: 0.7, borderRadius: 3 }}>
          <IconButton 
            size="small"
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))} 
            disabled={currentIndex === 0}
            sx={{ bgcolor: currentIndex === 0 ? 'transparent' : '#fff', boxShadow: currentIndex === 0 ? 'none' : '0 2px 4px rgba(0,0,0,0.05)' }}
          >
            <ArrowBackIosNew sx={{ fontSize: 14 }} />
          </IconButton>

          <Typography variant="body2" sx={{ px: 2, fontWeight: 700, color: '#334155' }}>
            {currentIndex + 1} / {tradePairs.length}
          </Typography>

          <IconButton 
            size="small"
            onClick={() => setCurrentIndex(prev => Math.min(tradePairs.length - 1, prev + 1))} 
            disabled={currentIndex === tradePairs.length - 1}
            sx={{ bgcolor: currentIndex === tradePairs.length - 1 ? 'transparent' : '#fff', boxShadow: currentIndex === tradePairs.length - 1 ? 'none' : '0 2px 4px rgba(0,0,0,0.05)' }}
          >
            <ArrowForwardIos sx={{ fontSize: 14 }} />
          </IconButton>
        </Stack>
      </Stack>

      {/* Chart */}
      <Box sx={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={currentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}}
              dy={15}
            />
            <YAxis 
              domain={['auto', 'auto']} 
              axisLine={false}
              tickLine={false}
              tick={{fill: '#94a3b8', fontSize: 11}}
            />
            <Tooltip 
              cursor={{ stroke: '#10b981', strokeWidth: 1 }}
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
              }} 
            />
            <Area 
              type="monotone" 
              dataKey="rate" 
              stroke="#10b981" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#chartGradient)" 
              animationDuration={1200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default TradeChart;