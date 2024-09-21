import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { withParams } from './utils.js';
import { useNavigate } from 'react-router-dom';

const TableView = () => {
  const { tableid } = useParams()
  const navigate = useNavigate()
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const query = useQuery({ queryKey: [withParams('rows', { table_id: tableid })], enabled: !!tableid })
  const headers = useQuery({ queryKey: [withParams('header_from_table', { table_id: tableid })], enabled: !!tableid })

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ?
        'desc' : 'asc');
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
    if (sortColumn !== column) {
      return (
        <span className="pl-1">
          ▶
        </span>
      )
    }
    return (
      <span className="pl-1">
        {sortOrder === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  const { col1, col2, col3, col4 } = headers?.data || {}

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => navigate('/dashboard')} className="fixed top-6 left-4 bg-gray-50 text-black px-4 py-2 rounded-full shadow-lg hover:bg-gray-100 focus:outline-none transition-transform transform hover:scale-105"
      >
        Back
      </button>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        {sortedData.length > 0 &&
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                {!!col1 &&
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer" onClick={() => handleSort('col1')}>
                    {col1.name}({col1.type}) {renderSortIcon('col1')}
                  </th>
                }
                {!!col2 &&
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer" onClick={() => handleSort('col2')}>
                    {col2.name} ({col2.type}) {renderSortIcon('col2')}
                  </th>}
                {!!col3 &&
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer" onClick={() => handleSort('col3')}>
                    {col3.name} ({col3.type}) {renderSortIcon('col3')}
                  </th>}
                {!!col4 &&
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider cursor-pointer" onClick={() => handleSort('col4')}>
                    {col4.name} ({col4.type}) {renderSortIcon('col4')}
                  </th>}
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
