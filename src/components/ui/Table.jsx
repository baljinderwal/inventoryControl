import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableSortLabel from '@mui/material/TableSortLabel';
import Box from '@mui/material/Box';
import { visuallyHidden } from '@mui/utils';

const MuiTable = ({ headers, data, onSort, sortColumn, sortDirection }) => {
  const createSortHandler = (property) => (event) => {
    onSort(property);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell
                key={header.id}
                align={header.numeric ? 'right' : 'left'}
                padding={header.disablePadding ? 'none' : 'normal'}
                sortDirection={sortColumn === header.id ? sortDirection : false}
                sx={{ fontWeight: 'bold' }}
              >
                {header.isSortable ? (
                  <TableSortLabel
                    active={sortColumn === header.id}
                    direction={sortColumn === header.id ? sortDirection : 'asc'}
                    onClick={createSortHandler(header.id)}
                  >
                    {header.label}
                    {sortColumn === header.id ? (
                      <Box component="span" sx={visuallyHidden}>
                        {sortDirection === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                ) : (
                  header.label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              {headers.map(header => (
                <TableCell key={header.id}>
                  {row[header.id]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MuiTable;
