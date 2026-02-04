import React, { useState, useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography,
  TableFooter, Box, TablePagination
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

interface Column {
  id: string;
  label: string;
  align?: 'right' | 'left' | 'center';
}

interface ReusableTableProps {
  title: string;
  columns: Column[];
  rows: any[];
  toUnit: string;
}

const ReusableTable: React.FC<ReusableTableProps> = ({ title, columns, rows }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_: any, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Logic: Agar data 0 hai to 1 default row dikhao, warna real data
  const paginatedRows = useMemo(() => {
    if (rows.length === 0) {
      return [{
        userId: "DEFAULT-001",
        name: "Sample Transaction",
        realAmount: 100,
        fromCurrency: "USD",
        rate: 280,
        toCurrency: "PKR",
        date: new Date().toLocaleDateString(),
        amount: 28000
      }];
    }
    return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [rows, page, rowsPerPage]);

  const totals = useMemo(() => {
    if (rows.length === 0) return { realAmount: 0, rate: 0, converted: 0 };
    return {
      realAmount: rows.reduce((s, r) => s + (+r.realAmount || 0), 0),
      rate: rows.reduce((s, r) => s + (+r.rate || 0), 0),
      converted: rows.reduce((s, r) => s + (+r.amount || 0), 0),
    };
  }, [rows]);

  const fromCurrency = rows[0]?.fromCurrency || (rows.length === 0 ? 'USD' : '');
  const toCurrency = rows[0]?.toCurrency || (rows.length === 0 ? 'PKR' : '');

  return (
    <TableContainer component={Paper} sx={{ mb: 4, borderRadius: 2, boxShadow: 3, width: '100%', overflowX: 'auto' }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontSize: 18, fontWeight: 500 }}>{title}</Typography>
        <Typography variant="caption" color="text.secondary">Total: {rows.length}</Typography>
      </Box>

      <Table size={isMobile ? 'small' : 'medium'} sx={{ minWidth: 700 }}>
        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.id} align={col.align} sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {paginatedRows.map((row, index) => (
            <TableRow key={index} hover sx={{ opacity: rows.length === 0 ? 0.6 : 1 }}>
              <TableCell>{row.userId}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell align="center">{(+row.realAmount).toFixed(2)} {row.fromCurrency}</TableCell>
              <TableCell align="center">{(+row.rate).toFixed(2)} {row.toCurrency}</TableCell>
              <TableCell align="center">{row.date}</TableCell>
              <TableCell align="right" sx={{ color: rows.length === 0 ? 'text.secondary' : '#2e7d32', fontWeight: 500, fontSize:"15px" }}>
                {(+row.amount).toFixed(2)} {row.toCurrency}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter sx={{ bgcolor: '#fafafa' }}>
          <TableRow>
            <TableCell colSpan={2} />
            <TableCell align="center" sx={{ color: '#01579b', fontWeight: 500, fontSize:"15px" }}>{totals.realAmount.toFixed(2)} {fromCurrency}</TableCell>
            <TableCell align="center" sx={{ color: '#2e7d32' }}></TableCell>
            <TableCell />
            <TableCell align="right" sx={{ color: '#1b5e20', fontWeight: 500, fontSize:"15px" }}>{totals.converted.toFixed(2)} {toCurrency}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <TablePagination
        component="div"
        count={rows.length === 0 ? 1 : rows.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Rows:"
      />
    </TableContainer>
  );
};

export default React.memo(ReusableTable);