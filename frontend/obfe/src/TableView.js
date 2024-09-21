import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { withParams } from './utils.js';

const TableView = () => {
  const { tableid } = useParams()
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const query = useQuery({ queryKey: [withParams('rows', { table_id: tableid })], enabled: !!tableid })
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };


  const sortedData = [...query?.data?.rows || []].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const renderSortIcon = (column) => {
    if (sortColumn !== column) return null;
    return (
      <span className="ml-1">
        {sortOrder === 'asc' ? '▲' : sortOrder === 'desc' ? '▼' : ''}
      </span>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        {sortedData.length > 0 &&
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                  Name {renderSortIcon('name')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer" onClick={() => handleSort('email')}>
                  Email {renderSortIcon('email')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer" onClick={() => handleSort('role')}>
                  Role {renderSortIcon('role')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>
                  Status {renderSortIcon('status')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((row, index) => (
                <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors duration-200`}>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{row.col1}</div>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{row.col2}</div>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{row.col3}</div>
                  </td>
                  <td className="px-2 py-2 whitespace-nowrap">
                    {row.col4}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>}
      </div>
    </div>
  );
};

export default TableView;
