import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import { Paper, Typography, Grid, Box } from '@mui/material';

// Modern Color Palette
const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

const CurrencyChart = ({ chartData }: { chartData: any[] }) => {
    return (
        <Grid container spacing={3} sx={{ mb: 4, height:"60%" }}>

            {/* 1. Bar Chart */}
            <Grid size={{ xs: 12, md: 8 }}>
                <Paper sx={{
                    p: 3, borderRadius: 4, height: 400, boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    background: 'linear-gradient(to bottom, #ffffff, #fdfdff)'
                }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 500,fontSize:"18px" ,color: '#1e293b' }}>
                        Currency Volume Analysis
                    </Typography>
                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="barColor" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                                    <stop offset="100%" stopColor="#a5b4fc" stopOpacity={0.8} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                            <Tooltip
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            />
                            <Bar
                                dataKey="total"
                                fill="url(#barColor)"
                                radius={[6, 6, 0, 0]}
                                barSize={32}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Paper>
            </Grid>

            {/* 2. Pie Chart - Cleaned from TS Errors */}
            <Grid size={{ xs: 12, md: 4 }}>
                <Paper sx={{
                    p: 3, borderRadius: 4, height: 400, boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    display: 'flex', flexDirection: 'column'
                }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 500,fontSize:"18px", color: '#1e293b' }}>
                        Transaction Mix
                    </Typography>
                    <Box sx={{ flexGrow: 1, width: '100%', height: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="count"  
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    stroke="none"
                                >
                                    {chartData.map((_, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Legend iconType="circle" verticalAlign="bottom" wrapperStyle={{ paddingTop: '20px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>
            </Grid>

        </Grid>
    );
};



export default CurrencyChart;

 