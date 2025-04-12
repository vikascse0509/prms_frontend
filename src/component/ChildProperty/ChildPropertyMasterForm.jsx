// ChildPropertyMasterForm.jsx
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import ChildPropertyList from './ChildPropertyList';
// import ChildPropertyForm from './ChildPropertyForm';
// import ChildPropertyDetailModal from './ChildPropertyDetailModal';
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Grid,
//   IconButton,
//   Typography,
//   TextField,
//   Paper,
//   CircularProgress,
//   Container,
//   Card,
//   CardContent,
//   Divider,
//   InputAdornment
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import SearchIcon from '@mui/icons-material/Search';
// import CloseIcon from '@mui/icons-material/Close';
// import ApartmentIcon from '@mui/icons-material/Apartment';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

// export default function ChildPropertyMasterForm() {
//   // VITE_API_URL should include the /api/ prefix
//   const API_URL = import.meta.env.VITE_API_URL; // e.g., http://localhost:5000/api/

//   const [childProperties, setChildProperties] = useState([]);
//   const [parentProperties, setParentProperties] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [floorError, setFloorError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [formData, setFormData] = useState({
//     id: null,
//     property_id: '',
//     floor: '',
//     title: '',
//     description: '',
//     rooms: '',
//     washroom: '',
//     gas: '',
//     electricity: '',
//     deposit: '',
//     rent: ''
//   });
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedChildProperty, setSelectedChildProperty] = useState(null);

//   useEffect(() => {
//     fetchChildProperties();
//     fetchParentProperties();
//   }, []);

//   const fetchChildProperties = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get(`${API_URL}child_property`);
//       setChildProperties(response.data);
//     } catch (error) {
//       console.error('Error fetching child properties:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchParentProperties = async () => {
//     try {
//       const response = await axios.get(`${API_URL}property`);
//       setParentProperties(response.data);
//     } catch (error) {
//       console.error('Error fetching parent properties:', error);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'property_id') {
//       // When parent changes, reset the floor value and error
//       setFormData((prev) => ({ ...prev, property_id: value, floor: '' }));
//       setFloorError('');
//     } else if (name === 'floor') {
//       // Validate floor against the parent's numberOfFloors
//       const selectedParent = parentProperties.find((p) => p.id === parseInt(formData.property_id));
//       const floorValue = parseInt(value);
//       if (selectedParent && floorValue > selectedParent.numberOfFloors) {
//         setFloorError(`Maximum floor for ${selectedParent.propertyName} is ${selectedParent.numberOfFloors}`);
//       } else {
//         setFloorError('');
//       }
//       setFormData((prev) => ({ ...prev, floor: value }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (floorError) {
//       alert('Please fix the errors before submitting.');
//       return;
//     }
//     try {
//       const form = new FormData();
//       form.append('formData', JSON.stringify(formData));

//       if (formData.id) {
//         // Update existing child property
//         await axios.put(`${API_URL}child_property/${formData.id}`, form, {
//           headers: { 'Content-Type': 'multipart/form-data' }
//         });
//         alert('Child property updated successfully!');
//       } else {
//         // Create new child property
//         await axios.post(`${API_URL}child_property`, form, {
//           headers: { 'Content-Type': 'multipart/form-data' }
//         });
//         alert('Child property created successfully!');
//       }
//       fetchChildProperties();
//       resetForm();
//       setShowForm(false);
//     } catch (error) {
//       console.error('Error saving child property:', error);
//       alert('Failed to save child property!');
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       id: null,
//       property_id: '',
//       floor: '',
//       title: '',
//       description: '',
//       rooms: '',
//       washroom: '',
//       gas: '',
//       electricity: '',
//       deposit: '',
//       rent: ''
//     });
//     setFloorError('');
//   };

//   const handleEditClick = (childProperty) => {
//     try {
//       setFormData({
//         id: childProperty.id,
//         property_id: childProperty.property_id.toString(),
//         floor: childProperty.floor,
//         title: childProperty.title,
//         description: childProperty.description,
//         rooms: childProperty.rooms,
//         washroom: childProperty.washroom,
//         gas: childProperty.gas,
//         electricity: childProperty.electricity,
//         deposit: childProperty.deposit,
//         rent: childProperty.rent
//       });
//       setShowForm(true);
//     } catch (error) {
//       console.error('Error setting form data:', error);
//       alert('Failed to load child property details for editing.');
//     }
//   };

//   const handleDetailsClick = async (childProperty) => {
//     try {
//       setSelectedChildProperty(childProperty);
//       setIsModalOpen(true);
//     } catch (error) {
//       console.error('Error showing details:', error);
//       alert('Failed to load child property details.');
//     }
//   };

//   const handleDeleteClick = async (childProperty) => {
//     if (window.confirm('Are you sure you want to delete this child property?')) {
//       try {
//         await axios.delete(`${API_URL}child_property/${childProperty.id}`);
//         alert('Child property deleted successfully!');
//         fetchChildProperties();
//       } catch (error) {
//         console.error('Error deleting child property:', error);
//         alert('Failed to delete child property!');
//       }
//     }
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedChildProperty(null);
//   };

//   // Filter child properties based on search term
//   const filteredChildProperties = childProperties.filter(
//     (childProperty) => {
//       const parentProperty = parentProperties.find(p => p.id === childProperty.property_id);
//       const searchValue = searchTerm.toLowerCase();

//       return (
//         childProperty.title?.toLowerCase().includes(searchValue) ||
//         childProperty.description?.toLowerCase().includes(searchValue) ||
//         parentProperty?.propertyName?.toLowerCase().includes(searchValue) ||
//         childProperty.floor?.toString().toLowerCase().includes(searchValue) ||
//         childProperty.rent?.toString().includes(searchValue)
//       );
//     }
//   );

//   // Calculate statistics for dashboard
//   const getTotalRent = () => {
//     return childProperties.reduce((sum, cp) => sum + (parseFloat(cp.rent) || 0), 0);
//   };

//   const getActiveCount = () => {
//     return childProperties.filter(cp => cp.status === 'Active').length;
//   };

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       {/* Header */}
//       <Paper
//         elevation={0}
//         sx={{
//           p: 3,
//           mb: 4,
//           borderRadius: 2,
//           background: 'linear-gradient(to right, #e0f7fa, #b2ebf2)'
//         }}
//       >
//         <Grid container spacing={2} alignItems="center" justifyContent="space-between">
//           <Grid item xs={12} md={6}>
//             <Typography variant="h4" component="h1" fontWeight="bold" color="primary.dark">
//               Child Property Management
//             </Typography>
//             <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
//               Manage all your property units and floors in one place
//             </Typography>
//           </Grid>
//           <Grid item xs={12} md={6}>
//             <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
//               <TextField
//                 placeholder="Search child properties..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 variant="outlined"
//                 fullWidth
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <SearchIcon color="action" />
//                     </InputAdornment>
//                   )
//                 }}
//               />
//               <Button
//                 variant="contained"
//                 color="primary"
//                 startIcon={showForm ? <CloseIcon /> : <AddIcon />}
//                 onClick={() => {
//                   if (showForm) {
//                     setShowForm(false);
//                     resetForm();
//                   } else {
//                     setShowForm(true);
//                   }
//                 }}
//               >
//                 {showForm ? "Close Form" : "Add Child Property"}
//               </Button>
//             </Box>
//           </Grid>
//         </Grid>
//       </Paper>

//       {/* Dashboard Cards */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid item xs={12} md={6}>
//           <Card
//             elevation={2}
//             sx={{
//               borderLeft: '4px solid #2196f3',
//               height: '100%',
//               cursor: 'pointer',
//               transition: 'transform 0.2s',
//               '&:hover': {
//                 transform: 'translateY(-4px)',
//                 boxShadow: '0 12px 20px -10px rgba(33, 150, 243, 0.28)'
//               }
//             }}
//             onClick={() => setSearchTerm('')}
//           >
//             <CardContent>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <Box>
//                   <Typography variant="overline" color="text.secondary">
//                     Total Units
//                   </Typography>
//                   <Typography variant="h4" fontWeight="bold">
//                     {childProperties.length}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ p: 1.5, bgcolor: '#e3f2fd', borderRadius: '50%' }}>
//                   <ApartmentIcon fontSize="large" color="primary" />
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <Card
//             elevation={2}
//             sx={{
//               borderLeft: '4px solid #ff9800',
//               height: '100%',
//               cursor: 'pointer',
//               transition: 'transform 0.2s',
//               '&:hover': {
//                 transform: 'translateY(-4px)',
//                 boxShadow: '0 12px 20px -10px rgba(255, 152, 0, 0.28)'
//               }
//             }}
//             onClick={() => setSearchTerm('')}
//           >
//             <CardContent>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <Box>
//                   <Typography variant="overline" color="text.secondary">
//                     Total Rent Value
//                   </Typography>
//                   <Typography variant="h4" fontWeight="bold">
//                     ₹{getTotalRent().toLocaleString()}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ p: 1.5, bgcolor: '#fff3e0', borderRadius: '50%' }}>
//                   <AttachMoneyIcon fontSize="large" color="warning" />
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Add/Edit Child Property Form */}
//       {showForm && (
//         <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
//           <Typography variant="h5" sx={{ mb: 3 }}>
//             {formData.id ? 'Edit Child Property' : 'Add New Child Property'}
//           </Typography>
//           <ChildPropertyForm
//             formData={formData}
//             handleInputChange={handleInputChange}
//             handleSubmit={handleSubmit}
//             parentProperties={parentProperties}
//             floorError={floorError}
//           />
//         </Paper>
//       )}

//       {/* Child Properties Listing */}
//       <Paper sx={{ p: 3, borderRadius: 2 }}>
//         <Typography variant="h5" sx={{ mb: 2 }}>
//           Child Property Listings
//         </Typography>
//         <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//           View and manage all your property units
//         </Typography>

//         <Divider sx={{ mb: 3 }} />

//         {isLoading ? (
//           <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
//             <CircularProgress />
//           </Box>
//         ) : filteredChildProperties.length > 0 ? (
//           <ChildPropertyList
//             childProperties={filteredChildProperties}
//             parentProperties={parentProperties}
//             onDetailsClick={handleDetailsClick}
//             onEditClick={handleEditClick}
//             onDeleteClick={handleDeleteClick}
//           />
//         ) : (
//           <Box sx={{ textAlign: 'center', py: 5 }}>
//             <Typography variant="h6">
//               {searchTerm ? 'No child properties found matching your search' : 'No child properties available'}
//             </Typography>
//             <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//               {searchTerm ? 'Try adjusting your search' : 'Click the "Add Child Property" button to get started'}
//             </Typography>
//             {searchTerm && (
//               <Button
//                 sx={{ mt: 2 }}
//                 onClick={() => setSearchTerm('')}
//                 variant="outlined"
//               >
//                 Clear Search
//               </Button>
//             )}
//           </Box>
//         )}
//       </Paper>

//       {/* Child Property Details Modal */}
//       {isModalOpen && selectedChildProperty && (
//         <Dialog
//           open={isModalOpen}
//           onClose={closeModal}
//           maxWidth="md"
//           fullWidth
//         >
//           <DialogTitle>
//             <Typography variant="h6">
//               Child Property Details
//             </Typography>
//             <IconButton
//               onClick={closeModal}
//               sx={{ position: 'absolute', right: 8, top: 8 }}
//             >
//               <CloseIcon />
//             </IconButton>
//           </DialogTitle>
//           <DialogContent dividers>
//             <ChildPropertyDetailModal
//               childProperty={selectedChildProperty}
//               parentProperties={parentProperties}
//               onClose={closeModal}
//               refreshChildProperties={fetchChildProperties}
//               apiUrl={API_URL}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={closeModal}>Close</Button>
//           </DialogActions>
//         </Dialog>
//       )}
//     </Container>
//   );
// }

// 18-03
// import { toast } from 'react-toastify';
// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import ChildPropertyList from './ChildPropertyList';
// import ChildPropertyForm from './ChildPropertyForm';
// import ChildPropertyDetailModal from './ChildPropertyDetailModal';
// import {
//   Box,
//   Button,
//   Typography,
//   TextField,
//   Paper,
//   CircularProgress,
//   Container,
//   Card,
//   CardContent,
//   Divider,
//   InputAdornment,
//   Grid
// } from '@mui/material';
// import SearchIcon from '@mui/icons-material/Search';
// import AddIcon from '@mui/icons-material/Add';
// import ApartmentIcon from '@mui/icons-material/Apartment';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
// import DeleteConfirmationModal from 'component/DeleteModal/DeleteConfirmationModal';
// export default function ChildPropertyMasterForm() {
//   const API_URL = import.meta.env.VITE_API_URL;

//   const [childProperties, setChildProperties] = useState([]);
//   const [parentProperties, setParentProperties] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [floorError, setFloorError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [formData, setFormData] = useState({
//     id: null,
//     property_id: '',
//     floor: '',
//     title: '',
//     description: '',
//     rooms: '',
//     washroom: '',
//     gas: '',
//     electricity: '',
//     deposit: '',
//     rent: ''
//   });
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedChildProperty, setSelectedChildProperty] = useState(null);

//   // Delete Dialog Modal
//   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//   const [childPropertyToDelete, setChildPropertyToDelete] = useState(null);

//   useEffect(() => {
//     fetchChildProperties();
//     fetchParentProperties();
//   }, []);

//   const fetchChildProperties = async () => {
//     setIsLoading(true);
//     try {
//       const response = await axios.get(`${API_URL}child_property`);
//       setChildProperties(response.data);
//     } catch (error) {
//       console.error('Error fetching child properties:', error);
//       toast.error('Error fetching child properties!');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchParentProperties = async () => {
//     try {
//       const response = await axios.get(`${API_URL}property`);
//       setParentProperties(response.data);
//     } catch (error) {
//       console.error('Error fetching parent properties:', error);
//       toast.error('Error fetching parent properties!');
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'property_id') {
//       setFormData((prev) => ({ ...prev, property_id: value, floor: '' }));
//       setFloorError('');
//     } else if (name === 'floor') {
//       const selectedParent = parentProperties.find((p) => p.id === parseInt(formData.property_id));
//       const floorValue = parseInt(value);
//       if (selectedParent && floorValue > selectedParent.numberOfFloors) {
//         setFloorError(`Maximum floor for ${selectedParent.propertyName} is ${selectedParent.numberOfFloors}`);
//       } else {
//         setFloorError('');
//       }
//       setFormData((prev) => ({ ...prev, floor: value }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     if (floorError) {
//       // alert('Please fix the errors before submitting.');
//       toast.warn('Please fix the error before subbmitting!');
//       return;
//     }
//     try {
//       const form = new FormData();
//       form.append('formData', JSON.stringify(formData));

//       if (formData.id) {
//         await axios.put(`${API_URL}child_property/${formData.id}`, form, {
//           headers: { 'Content-Type': 'multipart/form-data' }
//         });
//         // alert('Child property updated successfully!');
//         toast.success('Child property updated successfully!');
//       } else {
//         await axios.post(`${API_URL}child_property`, form, {
//           headers: { 'Content-Type': 'multipart/form-data' }
//         });
//         // alert('Child property created successfully!');
//         toast.success('Child property created successfully!');
//       }
//       fetchChildProperties();
//       resetForm();
//       setShowForm(false);
//     } catch (error) {
//       console.error('Error saving child property:', error);
//       // alert('Failed to save child property!');
//       toast.error('Failed to save child property!');
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       id: null,
//       property_id: '',
//       floor: '',
//       title: '',
//       description: '',
//       rooms: '',
//       washroom: '',
//       gas: '',
//       electricity: '',
//       deposit: '',
//       rent: ''
//     });
//     setFloorError('');
//   };

//   const handleEditClick = (childProperty) => {
//     setFormData({
//       id: childProperty.id,
//       property_id: childProperty.property_id.toString(),
//       floor: childProperty.floor,
//       title: childProperty.title,
//       description: childProperty.description,
//       rooms: childProperty.rooms,
//       washroom: childProperty.washroom,
//       gas: childProperty.gas,
//       electricity: childProperty.electricity,
//       deposit: childProperty.deposit,
//       rent: childProperty.rent
//     });
//     setShowForm(true);
//   };

//   const handleDetailsClick = (childProperty) => {
//     setSelectedChildProperty(childProperty);
//     setIsModalOpen(true);
//   };

//   const handleDeleteClick = (childProperty) => {
//     setChildPropertyToDelete(childProperty);
//     setDeleteModalOpen(true);
//   };

//   const handleDeleteConfirm = async () => {
//     if (childPropertyToDelete) {
//       try {
//         await axios.delete(`${API_URL}child_property/${childPropertyToDelete.id}`);
//         toast.error('Child property deleted successfully!');
//         fetchChildProperties();
//       } catch (error) {
//         console.error('Error deleting child property:', error);
//         toast.error('Failed to delete child property!');
//       } finally {
//         setDeleteModalOpen(false);
//         setChildPropertyToDelete(null);
//       }
//     }
//   };

//   const handleDeleteCancel = () => {
//     setDeleteModalOpen(false);
//     setChildPropertyToDelete(null);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedChildProperty(null);
//   };

//   const filteredChildProperties = childProperties.filter((childProperty) => {
//     const parentProperty = parentProperties.find((p) => p.id === childProperty.property_id);
//     const searchValue = searchTerm.toLowerCase();
//     return (
//       childProperty.title?.toLowerCase().includes(searchValue) ||
//       childProperty.description?.toLowerCase().includes(searchValue) ||
//       parentProperty?.propertyName?.toLowerCase().includes(searchValue) ||
//       childProperty.floor?.toString().toLowerCase().includes(searchValue) ||
//       childProperty.rent?.toString().includes(searchValue) ||
//       childProperty.status?.toLowerCase().includes(searchValue)
//     );
//   });

//   const getTotalRent = () => childProperties.reduce((sum, cp) => sum + (parseFloat(cp.rent) || 0), 0);
//   const getActiveCount = () => childProperties.filter((cp) => cp.status === 'Active').length;

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       {/* Header */}
//       <Paper
//         elevation={0}
//         sx={{
//           p: 3,
//           mb: 4,
//           borderRadius: 2,
//           background: 'linear-gradient(to right, #e1f5fe, #b3e5fc)'
//         }}
//       >
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           <Box>
//             <Typography variant="h4" fontWeight="bold" color="primary.dark">
//               Child Property Management
//             </Typography>
//             <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
//               Manage all your property units and floors in one place
//             </Typography>
//           </Box>
//           <Box sx={{ display: 'flex', gap: 2 }}>
//             <TextField
//               placeholder="Search child properties..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               variant="outlined"
//               sx={{ flexGrow: 1 }}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <SearchIcon color="action" />
//                   </InputAdornment>
//                 )
//               }}
//             />
//             <Button
//               variant="contained"
//               color="primary"
//               startIcon={<AddIcon />}
//               onClick={() => {
//                 resetForm();
//                 setShowForm(true);
//               }}
//             >
//               Add Child Property
//             </Button>
//           </Box>
//         </Box>
//       </Paper>

//       {/* Dashboard Cards */}
//       <Grid container spacing={3} sx={{ mb: 4 }}>
//         <Grid item xs={12} md={6}>
//           <Card
//             elevation={2}
//             sx={{
//               borderLeft: '4px solid #2196f3',
//               height: '100%',
//               cursor: 'pointer',
//               transition: 'transform 0.2s',
//               '&:hover': {
//                 transform: 'translateY(-4px)',
//                 boxShadow: '0 12px 20px -10px rgba(33, 150, 243, 0.28)'
//               }
//             }}
//             onClick={() => setSearchTerm('')}
//           >
//             <CardContent>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <Box>
//                   <Typography variant="overline" color="text.secondary">
//                     Total Units
//                   </Typography>
//                   <Typography variant="h4" fontWeight="bold">
//                     {childProperties.length}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ p: 1.5, bgcolor: '#e3f2fd', borderRadius: '50%' }}>
//                   <ApartmentIcon fontSize="large" color="primary" />
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <Card
//             elevation={2}
//             sx={{
//               borderLeft: '4px solid #ff9800',
//               height: '100%',
//               cursor: 'pointer',
//               transition: 'transform 0.2s',
//               '&:hover': {
//                 transform: 'translateY(-4px)',
//                 boxShadow: '0 12px 20px -10px rgba(255, 152, 0, 0.28)'
//               }
//             }}
//             onClick={() => setSearchTerm('')}
//           >
//             <CardContent>
//               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                 <Box>
//                   <Typography variant="overline" color="text.secondary">
//                     Total Rent Value
//                   </Typography>
//                   <Typography variant="h4" fontWeight="bold">
//                     ₹{getTotalRent().toLocaleString()}
//                   </Typography>
//                 </Box>
//                 <Box sx={{ p: 1.5, bgcolor: '#fff3e0', borderRadius: '50%' }}>
//                   <AttachMoneyIcon fontSize="large" color="warning" />
//                 </Box>
//               </Box>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* Add/Edit Child Property Form Modal */}
//       <ChildPropertyForm
//         open={showForm}
//         formData={formData}
//         onInputChange={handleInputChange}
//         onSubmit={handleSubmit}
//         onClose={() => setShowForm(false)}
//         parentProperties={parentProperties}
//         floorError={floorError}
//       />

//       {/* Child Properties Listing */}
//       <Paper sx={{ p: 3, borderRadius: 2 }}>
//         <Typography variant="h5" sx={{ mb: 2 }}>
//           Child Property Listings
//         </Typography>
//         <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
//           View and manage all your property units
//         </Typography>
//         <Divider sx={{ mb: 3 }} />
//         {isLoading ? (
//           <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
//             <CircularProgress />
//           </Box>
//         ) : filteredChildProperties.length > 0 ? (
//           <ChildPropertyList
//             childProperties={filteredChildProperties}
//             parentProperties={parentProperties}
//             onAddClick={() => {
//               resetForm();
//               setShowForm(true);
//             }}
//             showForm={showForm}
//             onEditClick={handleEditClick}
//             onDetailsClick={handleDetailsClick}
//             onDeleteClick={handleDeleteClick}
//           />
//         ) : (
//           <Box sx={{ textAlign: 'center', py: 5 }}>
//             <Typography variant="h6">
//               {searchTerm ? 'No child properties found matching your search' : 'No child properties available'}
//             </Typography>
//             <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//               {searchTerm ? 'Try adjusting your search' : 'Click the "Add Child Property" button to get started'}
//             </Typography>
//             {searchTerm && (
//               <Button sx={{ mt: 2 }} onClick={() => setSearchTerm('')} variant="outlined">
//                 Clear Search
//               </Button>
//             )}
//           </Box>
//         )}
//       </Paper>

//       {/* Child Property Details Modal */}
//       {isModalOpen && selectedChildProperty && (
//         <ChildPropertyDetailModal
//           childProperty={selectedChildProperty}
//           parentProperties={parentProperties}
//           onClose={closeModal}
//           refreshChildProperties={fetchChildProperties}
//           apiUrl={API_URL}
//         />
//       )}

//       {/* Delete Confirmation Modal */}
//       <DeleteConfirmationModal
//         open={deleteModalOpen}
//         onClose={handleDeleteCancel}
//         onConfirm={handleDeleteConfirm}
//         message="Are you sure you want to delete this child property?"
//       />
//     </Container>
//   );
// }

// 01-04-25
// childPropertyMasterForm.jsx
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ChildPropertyList from './ChildPropertyList';
import ChildPropertyForm from './ChildPropertyForm';
import ChildPropertyDetailModal from './ChildPropertyDetailModal';
import {
  Box,
  Button,
  Typography,
  TextField,
  Paper,
  CircularProgress,
  Container,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ApartmentIcon from '@mui/icons-material/Apartment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DeleteConfirmationModal from 'component/DeleteModal/DeleteConfirmationModal';

export default function ChildPropertyMasterForm() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [childProperties, setChildProperties] = useState([]);
  const [parentProperties, setParentProperties] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [floorError, setFloorError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: null,
    property_id: '',
    floor: '',
    title: '',
    description: '',
    rooms: '',
    washroom: '',
    gas: '',
    electricity: '',
    deposit: '',
    rent: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChildProperty, setSelectedChildProperty] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [childPropertyToDelete, setChildPropertyToDelete] = useState(null);

  useEffect(() => {
    fetchChildProperties();
    fetchParentProperties();
  }, []);

  const fetchChildProperties = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}child_property`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChildProperties(response.data);
    } catch (error) {
      console.error('Error fetching child properties:', error);
      toast.error('Error fetching child properties!');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchParentProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}property`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setParentProperties(response.data);
    } catch (error) {
      console.error('Error fetching parent properties:', error);
      toast.error('Error fetching parent properties!');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'property_id') {
      setFormData((prev) => ({ ...prev, property_id: value, floor: '' }));
      setFloorError('');
    } else if (name === 'floor') {
      const selectedParent = parentProperties.find((p) => p.id === parseInt(formData.property_id));
      const floorValue = parseInt(value);
      if (selectedParent && floorValue > selectedParent.numberOfFloors) {
        setFloorError(`Maximum floor for ${selectedParent.propertyName} is ${selectedParent.numberOfFloors}`);
      } else {
        setFloorError('');
      }
      setFormData((prev) => ({ ...prev, floor: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    if (floorError) {
      toast.warn('Please fix the error before submitting!');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const form = new FormData();
      form.append('formData', JSON.stringify(formData));

      if (formData.id) {
        await axios.put(`${API_URL}child_property/${formData.id}`, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
        toast.success('Child property updated successfully!');
      } else {
        await axios.post(`${API_URL}child_property`, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
        toast.success('Child property created successfully!');
      }
      fetchChildProperties();
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error('Error saving child property:', error);
      toast.error('Failed to save child property!');
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      property_id: '',
      floor: '',
      title: '',
      description: '',
      rooms: '',
      washroom: '',
      gas: '',
      electricity: '',
      deposit: '',
      rent: ''
    });
    setFloorError('');
  };

  const handleEditClick = (childProperty) => {
    setFormData({
      id: childProperty.id,
      property_id: childProperty.property_id.toString(),
      floor: childProperty.floor,
      title: childProperty.title,
      description: childProperty.description,
      rooms: childProperty.rooms,
      washroom: childProperty.washroom,
      gas: childProperty.gas,
      electricity: childProperty.electricity,
      deposit: childProperty.deposit,
      rent: childProperty.rent
    });
    setShowForm(true);
  };

  const handleDetailsClick = (childProperty) => {
    setSelectedChildProperty(childProperty);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (childProperty) => {
    setChildPropertyToDelete(childProperty);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (childPropertyToDelete) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}child_property/${childPropertyToDelete.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Child property marked as deleted successfully!');
        fetchChildProperties();
      } catch (error) {
        console.error('Error marking child property as deleted:', error);
        toast.error('Failed to mark child property as deleted!');
      } finally {
        setDeleteModalOpen(false);
        setChildPropertyToDelete(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setChildPropertyToDelete(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedChildProperty(null);
  };

  const filteredChildProperties = childProperties.filter((childProperty) => {
    const parentProperty = parentProperties.find((p) => p.id === childProperty.property_id);
    const searchValue = searchTerm.toLowerCase();
    return (
      childProperty.title?.toLowerCase().includes(searchValue) ||
      childProperty.description?.toLowerCase().includes(searchValue) ||
      parentProperty?.propertyName?.toLowerCase().includes(searchValue) ||
      childProperty.floor?.toString().toLowerCase().includes(searchValue) ||
      childProperty.rent?.toString().includes(searchValue)
    );
  });

  const getTotalRent = () => childProperties.reduce((sum, cp) => sum + (parseFloat(cp.rent) || 0), 0);
  const getActiveCount = () => childProperties.filter((cp) => cp.status === 'Active').length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          background: 'linear-gradient(to right, #e1f5fe, #b3e5fc)'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary.dark">
              Child Property Management
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Manage all your property units and floors in one place
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              placeholder="Search child properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              sx={{ flexGrow: 1 }}
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
              Add Child Property
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Dashboard Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card
            elevation={2}
            sx={{
              borderLeft: '4px solid #2196f3',
              height: '100%',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 20px -10px rgba(33, 150, 243, 0.28)'
              }
            }}
            onClick={() => setSearchTerm('')}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    Total Units
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {childProperties.length}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, bgcolor: '#e3f2fd', borderRadius: '50%' }}>
                  <ApartmentIcon fontSize="large" color="primary" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            elevation={2}
            sx={{
              borderLeft: '4px solid #ff9800',
              height: '100%',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 20px -10px rgba(255, 152, 0, 0.28)'
              }
            }}
            onClick={() => setSearchTerm('')}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    Total Rent Value
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    ₹{getTotalRent().toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ p: 1.5, bgcolor: '#fff3e0', borderRadius: '50%' }}>
                  <AttachMoneyIcon fontSize="large" color="warning" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add/Edit Child Property Form Modal */}
      <ChildPropertyForm
        open={showForm}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onClose={() => setShowForm(false)}
        parentProperties={parentProperties}
        floorError={floorError}
      />

      {/* Child Properties Listing */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Child Property Listings
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          View and manage all your property units
        </Typography>
        <Divider sx={{ mb: 3 }} />
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : filteredChildProperties.length > 0 ? (
          <ChildPropertyList
            childProperties={filteredChildProperties}
            parentProperties={parentProperties}
            onAddClick={() => {
              resetForm();
              setShowForm(true);
            }}
            showForm={showForm}
            onEditClick={handleEditClick}
            onDetailsClick={handleDetailsClick}
            onDeleteClick={handleDeleteClick}
          />
        ) : (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6">
              {searchTerm ? 'No child properties found matching your search' : 'No child properties available'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {searchTerm ? 'Try adjusting your search' : 'Click the "Add Child Property" button to get started'}
            </Typography>
            {searchTerm && (
              <Button sx={{ mt: 2 }} onClick={() => setSearchTerm('')} variant="outlined">
                Clear Search
              </Button>
            )}
          </Box>
        )}
      </Paper>

      {/* Child Property Details Modal */}
      {isModalOpen && selectedChildProperty && (
        <ChildPropertyDetailModal
          childProperty={selectedChildProperty}
          parentProperties={parentProperties}
          onClose={closeModal}
          refreshChildProperties={fetchChildProperties}
          apiUrl={API_URL}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        message="Are you sure you want to mark this child property as deleted? It will be hidden but not permanently removed."
      />
    </Container>
  );
}
