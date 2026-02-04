import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TableFooter,
  Box,
  TablePagination
} from '@mui/material';

import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

/*   TYPES   */

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

/*   COMPONENT   */

const ReusableTable: React.FC<ReusableTableProps> = ({
  title,
  columns,
  rows
}) => {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  /*   PAGINATION   */

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  /*   SLICE DATA   */

  const paginatedRows = useMemo(() => {
    return rows.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }, [rows, page, rowsPerPage]);

  /*   TOTALS   */

  const totals = useMemo(() => {
    return {
      realAmount: rows.reduce((s, r) => s + (+r.realAmount || 0), 0),
      rate: rows.reduce((s, r) => s + (+r.rate || 0), 0),
      converted: rows.reduce((s, r) => s + (+r.amount || 0), 0),
    };
  }, [rows]);

  const fromCurrency = rows[0]?.fromCurrency || '';
  const toCurrency = rows[0]?.toCurrency || '';

  /*   UI   */

  return (
    <TableContainer
      component={Paper}
      sx={{
        mb: 4,
        borderRadius: 2,
        boxShadow: 3,
        width: '100%',
        overflowX: 'auto'
      }}
    >

      {/*   HEADER   */}

      <Box
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 500 }}>
          {title}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Total: {rows.length}
        </Typography>
      </Box>

      {/*  TABLE  */}

      <Table size={isMobile ? 'small' : 'medium'} sx={{ minWidth: 700 }}>

        {/* HEAD  */}

        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.id}
                align={col.align}
                sx={{
                  fontWeight: 500,
                  whiteSpace: 'nowrap'
                }}
              >
                {col.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* ===== BODY ===== */}

        <TableBody>

          {paginatedRows.map((row, index) => (
            <TableRow key={index} hover>

              <TableCell>
                {row.userId || `TRX-${index + 1}`}
              </TableCell>

              <TableCell>
                {row.name}
              </TableCell>

              <TableCell align="center">
                {(+row.realAmount).toFixed(2)} {row.fromCurrency}
              </TableCell>

              <TableCell align="center">
                {(+row.rate).toFixed(2)} {row.toCurrency}
              </TableCell>

              <TableCell align="center">
                {row.date}
              </TableCell>

              <TableCell align="right" sx={{ color: '#2e7d32' }}>
                {(+row.amount).toFixed(2)} {row.toCurrency}
              </TableCell>

            </TableRow>
          ))}

          {/* Empty rows fix */}
          {paginatedRows.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No Data
              </TableCell>
            </TableRow>
          )}

        </TableBody>

        <TableFooter sx={{ bgcolor: '#fafafa' }}>
          <TableRow>

            <TableCell colSpan={2} align="center" />

            <TableCell align="center" sx={{ color: '#01579b' }}>
              {totals.realAmount.toFixed(2)} {fromCurrency}
            </TableCell>

            <TableCell align="center" sx={{ color: '#2e7d32' }}>
              {totals.rate.toFixed(2)} {toCurrency}
            </TableCell>

            <TableCell />

            <TableCell align="right" sx={{ color: '#1b5e20' }}>
              {totals.converted.toFixed(2)} {toCurrency}
            </TableCell>

          </TableRow>
        </TableFooter>

      </Table>

      <TablePagination
        component="div"
        count={rows.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="pages"
      />

    </TableContainer>
  );
};

 
export default React.memo(ReusableTable);
