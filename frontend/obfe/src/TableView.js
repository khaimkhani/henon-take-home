import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { withParams } from './utils.js';

const TableView = () => {
  const { tableid } = useParams()
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  //const query = useQuery({ queryKey: [withParams('rows', { table_id: tableid })], enabled: !!tableid })

  const query = useInfiniteQuery({
    queryKey: [withParams('rows', { table_id: tableid })],
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.next) return null;
      return allPages.length + 1
    },
    enabled: !!tableid,
  })

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  const sortedData = [...query?.data?.pages[0]?.results?.rows || []].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const renderSortIcon = (column) => {
    if (sortColumn !== column) return null;
    return (
      <span className="ml-1">
        {sortOrder === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  console.log(query.data)
  return (
    <div className="container mx-auto p-6">
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        {sortedData.length > 0 &&
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                  Name {renderSortIcon('name')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer" onClick={() => handleSort('email')}>
                  Email {renderSortIcon('email')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer" onClick={() => handleSort('role')}>
                  Role {renderSortIcon('role')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>
                  Status {renderSortIcon('status')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedData.map((row, index) => (
                <tr key={row.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors duration-200`}>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{row.col1}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{row.col2}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{row.col3}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {row.col4}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>}
        {query.hasNextPage &&
          <button
            onClick={() => query.fetchNextPage()}
            disabled={query.isFetching}
            className={`px-4 py-2 my-4 bg-blue-500 text-white rounded-lg 
                  hover:bg-blue-600 focus:outline-none focus:ring-2 
                  focus:ring-blue-400 focus:ring-opacity-75 
                  ${query.isFetchingNextPage ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            {query.isFetching ? 'Loading...' : 'Load More'}
          </button>
        }
      </div>
    </div>
  );
};

export default TableView;
