// 01-04-25
import React, { useState, useEffect } from 'react';
import PaginatedList from '../Pagination/Pagination';
import { Tooltip, Chip, IconButton, Box, Typography, Card, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';

const itemsPerPage = 5;

export default function PropertyList({ properties, onEdit, handleDeleteClick, onDetails, apiUrl, onAddClick }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // No need for local propertyList state since the parent manages the data
  const filteredProperties = properties.filter((property) =>
    Object.values(property).some((val) => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = filteredProperties.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusColor = (status) => {
    if (!status) return 'primary';

    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'pending':
        return 'warning';
      case 'deleted':
        return 'error';
      default:
        return 'primary';
    }
  };

  return (
    <Card
      sx={{
        p: 3,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        borderRadius: 2,
        '&:hover': {
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)'
        },
        transition: 'box-shadow 0.3s ease-in-out'
      }}
    >
      <div className="overflow-x-auto">
        {paginatedProperties.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body1" color="textSecondary">
              {searchTerm ? 'No properties match your search.' : 'No properties found.'}
            </Typography>
          </Box>
        ) : (
          <table className="min-w-full divide-gray-200 border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Property Title</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Document</th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedProperties.map((prop) => (
                <tr key={prop.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{prop.ownerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{prop.propertyName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <Tooltip title={prop.address} arrow>
                      <span className="truncate inline-block max-w-[150px]">{prop.address}</span>
                    </Tooltip>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Chip label={prop.status || 'Active'} color={getStatusColor(prop.status)} size="small" variant="outlined" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {prop.documents ? (
                      <Button
                        href={prop.documents} // Use the Cloudinary URL directly
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outlined"
                        size="small"
                        color="primary"
                        sx={{ fontSize: '12px' }}
                      >
                        View Document
                      </Button>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        No documents
                      </Typography>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2 justify-center">
                      <button className="text-blue-600 hover:text-blue-900 px-3 py-1 bg-blue-100 rounded" onClick={() => onEdit(prop)}>
                        Edit
                      </button>
                      <button
                        className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
                        onClick={() => handleDeleteClick(prop)} // Delegate to parent
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <Box sx={{ mt: 3 }}>
        <PaginatedList properties={filteredProperties} currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </Box>
    </Card>
  );
}
