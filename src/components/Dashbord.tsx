import React, { useState, useEffect, useMemo } from 'react';
import {
  Container, Typography, Box, Paper, Grid,
  Button, TextField, Stack, Alert
} from '@mui/material';
import ReusableTable from '../components/ReusableTable';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import type { ExchangeRecord } from '../types/types';
import CurrencyChart from './CurrencyChart';
import TradeChart from './TradeChart';

const Dashboard: React.FC = () => {
  const [allData, setAllData] = useState<ExchangeRecord[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateError, setDateError] = useState('');
  const [searchParams] = useSearchParams();

  const filterCurrency = searchParams.get('filter');
  const navigate = useNavigate();
  useEffect(() => {
    const savedData = localStorage.getItem('exchangeData');
    if (savedData) {
      setAllData(JSON.parse(savedData));
    }
  }, []);

  // Auto-filter validation
  useEffect(() => {
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setDateError("Start date end date se bari nahi ho sakti!");
    } else {
      setDateError("");
    }
  }, [startDate, endDate]);

  const columns = [
    { id: 'userId', label: 'ID' },
    { id: 'name', label: 'User Name' },
    { id: 'fromCurrency', label: 'Source', align: 'center' as const },
    { id: 'toCurrency', label: 'Target', align: 'center' as const },
    { id: 'date', label: 'Date', align: 'center' as const },
    { id: 'amount', label: 'Net Amount', align: 'right' as const },
  ];

  // Sirf Date Filter Clear karne ke liye
  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
    setDateError('');
  };

  // Poora Database Delete karne ke liye
  const handleClearAllData = () => {
    if (window.confirm("Are you Sure Delete Data Permanently!")) {
      localStorage.removeItem('exchangeData');
      setAllData([]);
    }
  };


  const getFilteredDataByDate = (data: ExchangeRecord[]) => {
    if (!startDate || !endDate || dateError) return data;

    const start = new Date(startDate).setHours(0, 0, 0, 0);
    const end = new Date(endDate).setHours(23, 59, 59, 999);


    return data.filter((item) => {
      const itemDate = new Date(item.date).getTime();
      return itemDate >= start && itemDate <= end;
    });
  };

  const filteredPairs = Array.from(
    new Set(allData.map(d => `${d.fromCurrency}-${d.toCurrency}`))
  )
    .map(str => {
      const [from, to] = str.split('-');
      return { from, to };
    })
    .filter(pair => !filterCurrency || pair.from === filterCurrency);
  const hasTransactionsForCurrency = allData.some(d => d.fromCurrency === filterCurrency);
  ///
  const stats = useMemo(() => {
    const totalVolume = allData.reduce((sum, item) => sum + Number(item.amount), 0);
    const counts: any = {};
    allData.forEach(d => counts[d.fromCurrency] = (counts[d.fromCurrency] || 0) + 1);
    const mostUsed = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, 'N/A');

    return { totalVolume, totalTransactions: allData.length, mostUsed };
  }, [allData]);


  /////chart logic
  // const filterCurrency = searchParams.get('filter');
  const chartData = useMemo(() => {
    const dataMap: any = {};

    allData.forEach(item => {
      const key = item.fromCurrency;
      if (!dataMap[key]) {
        // ✅ 'count' ko 0 se initialize zaroor karein
        dataMap[key] = { name: key, total: 0, count: 0 };
      }
      dataMap[key].total += parseFloat(item.amount) || 0;
      dataMap[key].count += 1; // ✅ Har entry par count barhayein
    });

    return Object.values(dataMap);
  }, [allData]);


  return (
    <Container sx={{
      mt: { xs: 10, md: 5 },
      ml: { xs: 0, sm: "10px", md: "90px" },
      width: 'auto',
      maxWidth: '100% !important',
      px: { xs: 2, md: 4 }
    }}>

 {/* Date and card */}
<Box sx={{ p: 3, mb: 4, bgcolor: '#f8f9fa', borderRadius: 3, border: '1px solid #e0e0e0' }}>
  <Grid container spacing={3} alignItems="flex-end">
    
    {/* Date Inputs */}
    <Grid size={{ xs: 12, sm: 6, md: 2.25 }}>
      <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary', mb: 0.5, display: 'block' }}>
        START DATE
      </Typography>
      <TextField
        type="date" size="small" fullWidth
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ bgcolor: 'white' }}
      />
    </Grid>

    <Grid size={{ xs: 12, sm: 6, md: 2.25 }}>
      <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.secondary', mb: 0.5, display: 'block' }}>
        END DATE
      </Typography>
      <TextField
        type="date" size="small" fullWidth
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ bgcolor: 'white' }}
      />
    </Grid>

    {/* Action Buttons */}
    <Grid size={{ xs: 6, md: 1.5 }}>
      <Button
        variant="outlined"
        fullWidth
        color="inherit"
        sx={{ height: 40, textTransform: "none", fontWeight: 400 }}
        onClick={handleClearFilter}
      >
        Reset
      </Button>
    </Grid>

    <Grid size={{ xs: 6, md: 1.5 }}>
      <Button
        variant="contained"
        fullWidth
        color="error"
        startIcon={<DeleteSweepIcon />}
        sx={{ height: 40, textTransform: "none", fontWeight: 400, boxShadow: 'none' }}
        onClick={handleClearAllData}
      >
        Clear
      </Button>
    </Grid>

    {/* Statistics Cards */}
    <Grid size={{ xs: 12, md: 4.5 }}>
      <Stack direction="row"  spacing={2} sx={{ height: 40,textAlign:"center" }}>
        {[
          { label: 'Transactions', value: stats.totalTransactions, color: '#2e7d32' },
          { label: 'Top Currency', value: stats.mostUsed, color: '#ed6c02' }
        ].map((card, i) => (
          <Paper 
            key={i} 
            elevation={0}
            sx={{ 
              flex: 1,
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              px: 2, 
              borderLeft: `4px solid ${card.color}`,
              bgcolor: 'background.paper',
              border: '1px solid #eee',
              borderLeftColor: card.color
            }}
          >
            <Typography sx={{ fontSize: '10px', fontWeight: 500, color: 'text.secondary', textTransform: 'uppercase' }}>
              {card.label}
            </Typography>
            <Typography sx={{ fontWeight: 500, fontSize: "14px", color: card.color }}>
              {card.value}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </Grid>
  </Grid>

  {dateError && (
    <Typography color="error" sx={{ mt: 2, fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
      ⚠️ {dateError}
    </Typography>
  )}
</Box>

      {/* // Return mein Table se pehle: */}
      <Typography  sx={{ mb: 2,fontSize:"20px" ,fontWeight: 500 }}>
        Market Overview
      </Typography>
      <CurrencyChart chartData={chartData} />

      {filterCurrency && (
        <Box sx={{ mb: 4 }}>
          <TradeChart
            allData={allData}
            activeCurrency={filterCurrency}
            onClose={() => navigate('/dashboard')} // Reset filter
          />
        </Box>
      )}


      {/* Currency Error Alert */}
      {filterCurrency && !hasTransactionsForCurrency && (
        <Alert
          severity="error"
          icon={<ErrorOutlineIcon fontSize="inherit" />}
          sx={{ mb: 3, bgcolor: '#fff5f5', color: '#d32f2f', border: '1px solid #ffcdd2' }}
        >
          No Transactions found for <strong>{filterCurrency}</strong>.
        </Alert>
      )}

      {/* Tabs Placeholder */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3, display: 'flex', gap: 4 }}>
        <Typography sx={{ pb: 1, borderBottom: '3px solid #1976d2', fontWeight: 500,fontSize:"20px", cursor: 'pointer' }}>
          ALL ENTRIES
        </Typography>

      </Box>

      {/* Tables Section */}
      <Grid container spacing={3}>
        {filteredPairs.map((pair) => {
          let tableRows = allData.filter(
            (d) => d.fromCurrency === pair.from && d.toCurrency === pair.to
          );

          tableRows = getFilteredDataByDate(tableRows);

          return tableRows.length > 0 ? (
            <Grid size={{ xs: 12}} key={`${pair.from}-${pair.to}`}>
              <ReusableTable
                title={`${pair.from} to ${pair.to}`}
                columns={columns}
                rows={tableRows}
                toUnit={pair.to}
              />
            </Grid>
          ) : null;
        })}
      </Grid>

      {/* No Rows Placeholder */}
      {(allData.length === 0 || (startDate && endDate && !dateError && filteredPairs.every(p => getFilteredDataByDate(allData.filter(d => d.fromCurrency === p.from && d.toCurrency === p.to)).length === 0))) && (
        <Paper sx={{ p: 8, textAlign: 'center', bgcolor: '#fff', border: '1px solid #eee' }}>
          <Typography color="textSecondary" variant="h6">No rows to display</Typography>
        </Paper>
      )}
    </Container>
  );
};

export default Dashboard;