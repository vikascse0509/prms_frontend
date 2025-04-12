// 02-04-25
import { toast } from 'react-toastify';
import { useState, useEffect, useMemo } from 'react';
import { ApiService } from './ApiService';
import AllocationTable from './AllocationTable';
import AllocationForm from './AllocationForm';
import AllocationDetailModal from './AllocationDetailModal';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
  Paper,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import DeleteConfirmationModal from 'component/DeleteModal/DeleteConfirmationModal';

export default function RentalAllocation() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [allocations, setAllocations] = useState([]);
  const [properties, setProperties] = useState([]);
  const [renters, setRenters] = useState([]);
  const [childProperties, setChildProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [formData, setFormData] = useState({
    renter_id: '',
    property_id: '',
    childproperty_id: '',
    allocation_date: '',
    remarks: '',
    rent_agreement: null,
    other_document: null,
    status: 'Active'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cardFilter, setCardFilter] = useState('all'); // 'all', 'active', 'overdue'
  const [alertMessage, setAlertMessage] = useState({ open: false, message: '', severity: 'info' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [allocationToDelete, setAllocationToDelete] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const {
        allocations: allocationsData,
        properties: propertiesData,
        renters: rentersData,
        childProperties: childPropertiesData
      } = await ApiService.refreshAllData();
      setAllocations(allocationsData);
      setProperties(propertiesData);
      setRenters(rentersData);
      setChildProperties(childPropertiesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data. Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAllocations = useMemo(() => {
    // First apply the card filter
    let filtered = allocations;
    
    if (cardFilter === 'active') {
      filtered = allocations.filter(a => a.status === 'Active');
    } else if (cardFilter === 'overdue') {
      const today = new Date();
      filtered = allocations.filter(allocation => {
        if (allocation.status !== 'Active') return false;
        const allocationDate = new Date(allocation.allocation_date);
        const daysDifference = Math.floor((today - allocationDate) / (1000 * 60 * 60 * 24));
        return daysDifference > 30;
      });
    }
    
    // Then apply the search term filter
    if (!searchTerm.trim()) return filtered;
    return filtered.filter((allocation) => {
      const renter = renters.find((r) => r.id === allocation.renter_id);
      const property = properties.find((p) => p.id === allocation.property_id);
      const childProperty = childProperties.find((cp) => cp.id === allocation.childproperty_id);
      const searchValue = searchTerm.toLowerCase();
      return (
        renter?.renterName?.toLowerCase().includes(searchValue) ||
        property?.propertyName?.toLowerCase().includes(searchValue) ||
        childProperty?.title?.toLowerCase().includes(searchValue) ||
        allocation?.status?.toLowerCase().includes(searchValue)
      );
    });
  }, [allocations, renters, properties, childProperties, searchTerm, cardFilter]);

  const showAlert = (message, severity = 'info') => {
    setAlertMessage({ open: true, message, severity });
  };

  const handleCloseAlert = () => {
    setAlertMessage({ ...alertMessage, open: false });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleFileChange = (e) => {
  //   const { name, files } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: files[0] }));
  // };

  const handleSubmit = async () => {
    try {
      const form = new FormData();
      form.append('renter_id', formData.renter_id);
      form.append('property_id', formData.property_id);
      form.append('childproperty_id', formData.childproperty_id);
      form.append('allocation_date', formData.allocation_date);
      form.append('remarks', formData.remarks);
      form.append('status', formData.status);

      if (formData.rent_agreement) form.append('rent_agreement', formData.rent_agreement);
      if (formData.other_document) form.append('other_document', formData.other_document);

      if (formMode === 'add') {
        await ApiService.createAllocation(form);
        toast.success('Allocation created successfully!');
      } else if (formMode === 'edit' && selectedAllocation) {
        await ApiService.updateAllocation(selectedAllocation.id || selectedAllocation.allocation_id, form);
        toast.success('Allocation updated successfully!');
      }

      fetchData();
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving allocation:', error);
      toast.error('Error saving allocation.');
    }
  };

  const resetForm = () => {
    setFormData({
      renter_id: '',
      property_id: '',
      childproperty_id: '',
      allocation_date: '',
      remarks: '',
      rent_agreement: null,
      other_document: null,
      status: 'Active'
    });
    setFormMode('add');
    setSelectedAllocation(null);
  };

  const handleEditClick = async (allocation) => {
    try {
      const allocationData = await ApiService.getAllocationDetails(allocation.id || allocation.allocation_id);
      setSelectedAllocation(allocationData);
      setFormData({
        renter_id: allocationData.renter_id || allocationData.renterId || '',
        property_id: allocationData.property_id || allocationData.propertyId || '',
        childproperty_id: allocationData.childproperty_id || '',
        allocation_date: allocationData.allocation_date || allocationData.startDate || '',
        remarks: allocationData.remarks || '',
        rent_agreement: null, // Reset to null for new upload
        other_document: null, // Reset to null for new upload
        status: allocationData.status || 'Active'
      });
      setFormMode('edit');
      setShowForm(true);
    } catch (error) {
      toast.error('Failed to load allocation details.');
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };
  const handleDetailsClick = async (allocation) => {
    try {
      const allocationData = await ApiService.getAllocationDetails(allocation.id || allocation.allocation_id);
      setSelectedAllocation(allocationData);
      setIsModalOpen(true);
    } catch (error) {
      toast.error('Failed to load allocation details.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAllocation(null);
  };

  const handleDeleteClick = (allocation) => {
    setAllocationToDelete(allocation);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (allocationToDelete) {
      try {
        await ApiService.deleteAllocation(allocationToDelete.id || allocationToDelete.allocation_id);
        toast.success('Allocation deleted successfully!'); // Changed to success as it's a soft delete
        fetchData();
      } catch (error) {
        console.error('Error Deleting Allocation:', error);
        toast.error('Failed to delete allocation!');
      } finally {
        setDeleteModalOpen(false);
        setAllocationToDelete(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setAllocationToDelete(null);
  };

  const getActiveAllocations = () => allocations.filter((a) => a.status === 'Active').length;

  // Function to calculate overdue rents
  const getOverdueRents = () => {
    if (!allocations || allocations.length === 0) return 0;
    
    const today = new Date();
    // Assume any active allocation with allocation_date more than 30 days ago is overdue
    return allocations.filter(allocation => {
      if (allocation.status !== 'Active') return false;
      const allocationDate = new Date(allocation.allocation_date);
      // Calculate the days since allocation
      const daysDifference = Math.floor((today - allocationDate) / (1000 * 60 * 60 * 24));
      return daysDifference > 30; // More than 30 days considered overdue
    }).length;
  };

  // Function to handle card click
  const handleCardClick = (filter) => {
    setCardFilter(filter);
    setSearchTerm(''); // Clear any existing search term for clarity
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          background: 'linear-gradient(to right, #e8f5e9, #c8e6c9)'
        }}
      >
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" fontWeight="bold" color="primary.dark">
              Rental Allocation Management
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Manage property rentals and allocations in one place
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                placeholder="Search allocations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  )
                }}
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
              >
                Add Allocation
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Dashboard Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card
            elevation={2}
            sx={{
              borderLeft: '4px solid #4caf50',
              height: '100%',
              transition: 'transform 0.2s',
              cursor: 'pointer',
              backgroundColor: cardFilter === 'all' ? '#f0f7f0' : 'white',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 20px -10px rgba(76, 175, 80, 0.28)'
              }
            }}
            onClick={() => handleCardClick('all')}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    Total Allocations
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {allocations.length}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, bgcolor: '#e8f5e9', borderRadius: '50%' }}>
                  <AssignmentIcon fontSize="large" color="success" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            elevation={2}
            sx={{
              borderLeft: '4px solid #2196f3',
              height: '100%',
              transition: 'transform 0.2s',
              cursor: 'pointer',
              backgroundColor: cardFilter === 'active' ? '#eaf6ff' : 'white',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 20px -10px rgba(33, 150, 243, 0.28)'
              }
            }}
            onClick={() => handleCardClick('active')}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    Active Allocations
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {getActiveAllocations()}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, bgcolor: '#e3f2fd', borderRadius: '50%' }}>
                  <CheckCircleIcon fontSize="large" color="primary" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            elevation={2}
            sx={{
              borderLeft: '4px solid #f44336',
              height: '100%',
              transition: 'transform 0.2s',
              cursor: 'pointer',
              backgroundColor: cardFilter === 'overdue' ? '#fff5f5' : 'white',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 20px -10px rgba(244, 67, 54, 0.28)'
              }
            }}
            onClick={() => handleCardClick('overdue')}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    Rent Dues
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {getOverdueRents()}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, bgcolor: '#ffebee', borderRadius: '50%' }}>
                  <MoneyOffIcon fontSize="large" color="error" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <AllocationForm
        open={showForm}
        mode={formMode}
        allocation={formData}
        onInputChange={handleInputChange}
        onFileChange={handleFileChange}
        onSubmit={handleSubmit}
        onClose={() => {
          resetForm();
          setShowForm(false);
        }}
        renters={renters}
        properties={properties}
        childProperties={childProperties}
        apiUrl={API_URL}
      />

      {/* Allocations Listing */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">
            {cardFilter === 'all' ? 'All Allocations' : 
             cardFilter === 'active' ? 'Active Allocations' : 
             'Overdue Rent Allocations'}
          </Typography>
          {cardFilter !== 'all' && (
            <Button 
              variant="outlined" 
              size="small" 
              onClick={() => setCardFilter('all')}
              startIcon={<AssignmentIcon />}
            >
              Show All
            </Button>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {cardFilter === 'all' ? 'Viewing all property rentals and allocations' : 
           cardFilter === 'active' ? 'Viewing only active property allocations' : 
           'Viewing allocations with overdue rent (>30 days)'}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : filteredAllocations.length > 0 ? (
          <AllocationTable
            allocations={filteredAllocations}
            renters={renters}
            properties={properties}
            childProperties={childProperties}
            onEdit={handleEditClick}
            onDetails={handleDetailsClick}
            apiUrl={API_URL}
            handleDeleteClick={handleDeleteClick}
          />
        ) : (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6">{searchTerm ? 'No allocations found matching your search' : 'No allocations available'}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {searchTerm ? 'Try adjusting your search' : 'Click the "Add Allocation" button to get started'}
            </Typography>
            {searchTerm && (
              <Button sx={{ mt: 2 }} onClick={() => setSearchTerm('')} variant="outlined">
                Clear Search
              </Button>
            )}
          </Box>
        )}
      </Paper>

      {/* Allocation Details Modal */}
      {isModalOpen && selectedAllocation && (
        <AllocationDetailModal
          allocation={selectedAllocation}
          onClose={closeModal}
          refreshAllocations={fetchData}
          apiUrl={API_URL}
          renters={renters}
          properties={properties}
          childProperties={childProperties}
        />
      )}

      {/* Alert Snackbar */}
      <Snackbar
        open={alertMessage.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alertMessage.severity} sx={{ width: '100%' }}>
          {alertMessage.message}
        </Alert>
      </Snackbar>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        message="Are you sure you want to delete this allocation? This action will hide it from the list but keep it in the database."
      />
    </Container>
  );
}
