'use client';

import { useState, useEffect } from 'react';
import { Container, Typography, Box, AppBar, Toolbar, IconButton, Chip, Tabs, Tab, TextField, Button, Grid, Paper } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Link from 'next/link';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Snowfall from '@/components/Snowfall';
import { useGift } from '@/context/GiftContext';
import { fetchLetters, Letter } from '@/services/letterService';

// --- Letters Tab Data ---
const LETTER_COLUMNS: GridColDef[] = [
    { field: '_id', headerName: 'ID', width: 220 },
    { field: 'childName', headerName: 'Child Name', width: 200 },
    { field: 'location', headerName: 'Location', width: 150 },
    { field: 'wishList', headerName: 'Wish List', width: 300 },
    {
        field: 'status',
        headerName: 'Status',
        width: 150,
        renderCell: (params) => {
            const color = params.value === 'Nice' ? 'success' : params.value === 'Naughty' ? 'error' : 'warning';
            return <Chip label={params.value} color={color as 'success' | 'error' | 'warning'} variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }} />;
        }
    },
    { field: 'action', headerName: 'Action', width: 150, renderCell: () => <Box sx={{ color: '#F8B229', cursor: 'pointer' }}>Review</Box> }
];

// --- Inventory Tab Data ---
const INVENTORY_COLUMNS: GridColDef[] = [
    { field: '_id', headerName: 'Gift ID', width: 220 },
    {
        field: 'image',
        headerName: 'Image',
        width: 100,
        renderCell: (params) => <Box component="img" src={params.value} sx={{ width: 50, height: 50, borderRadius: 1, objectFit: 'cover' }} />
    },
    { field: 'title', headerName: 'Gift Title', width: 250 },
    { field: 'stock', headerName: 'Stock (Est)', width: 150, renderCell: (params) => params.row.stock ?? Math.floor(Math.random() * 1000) },
];


export default function SantaDashboard() {
    const [tabValue, setTabValue] = useState(0);
    const { gifts, addGift } = useGift();
    const [letters, setLetters] = useState<Letter[]>([]);

    useEffect(() => {
        const loadLetters = async () => {
            try {
                const data = await fetchLetters();
                setLetters(data);
            } catch (error) {
                console.error('Error loading letters:', error);
            }
        };
        loadLetters();
    }, []);

    // Form State
    const [newTitle, setNewTitle] = useState('');
    const [newImage, setNewImage] = useState('');

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleAddGift = async () => {
        if (newTitle && newImage) {
            await addGift({ title: newTitle, image: newImage });
            setNewTitle('');
            setNewImage('');
            alert('Gift added to workshop!');
        }
    };

    return (
        <Box sx={{ position: 'relative', overflowX: 'hidden', minHeight: '100vh' }}>
            <Snowfall />

            {/* Admin Navbar */}
            <AppBar position="static" color="transparent" elevation={0} sx={{ pt: 2, bgcolor: 'rgba(5, 10, 24, 0.8)' }}>
                <Toolbar>
                    <Typography variant="h5" sx={{ flexGrow: 1, color: '#D42426', fontFamily: 'var(--font-mountains)' }}>
                        Santa's Command Center
                    </Typography>

                    <IconButton onClick={() => { localStorage.removeItem('token'); window.location.href = '/santa/login'; }} sx={{ color: 'white' }}>
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>

                <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ '& .MuiTab-root': { color: 'rgba(255,255,255,0.7)' }, '& .Mui-selected': { color: '#F8B229' }, '& .MuiTabs-indicator': { bgcolor: '#F8B229' } }}>
                    <Tab label="Letters" />
                    <Tab label="Workshop Inventory" />
                </Tabs>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 4 }}>

                {/* TAB 0: LETTERS */}
                {tabValue === 0 && (
                    <Box>
                        <Typography variant="h4" sx={{ mb: 4, color: 'white', fontFamily: 'var(--font-inter)' }}>
                            Incoming Letters
                        </Typography>
                        <Box sx={{ height: 500, width: '100%', bgcolor: 'rgba(0,0,0,0.5)', borderRadius: 2, backdropFilter: 'blur(10px)', p: 2 }}>
                            <DataGrid
                                getRowId={(row) => row._id || Math.random()}
                                rows={letters}
                                columns={LETTER_COLUMNS}
                                initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
                                pageSizeOptions={[5, 10]}
                                checkboxSelection
                                sx={{
                                    border: 'none',
                                    color: 'white',
                                    '& .MuiDataGrid-cell': { borderColor: 'rgba(255,255,255,0.1)' },
                                    '& .MuiDataGrid-columnHeaders': { borderColor: 'rgba(255,255,255,0.2)', bgcolor: 'rgba(255,255,255,0.05)' },
                                    '& .MuiTablePagination-root': { color: 'white' },
                                    '& .MuiCheckbox-root': { color: 'white' }
                                }}
                            />
                        </Box>
                    </Box>
                )}

                {/* TAB 1: INVENTORY */}
                {tabValue === 1 && (
                    <Box>
                        <Grid container spacing={4}>
                            {/* Add Gift Form */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', color: 'white' }}>
                                    <Typography variant="h5" sx={{ mb: 3, color: '#F8B229' }}>Add New Key Gift</Typography>
                                    <TextField
                                        fullWidth
                                        label="Gift Title"
                                        variant="outlined"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        sx={{ mb: 3, '& .MuiInputBase-input': { color: 'white' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }, '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' } }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Image URL"
                                        variant="outlined"
                                        value={newImage}
                                        onChange={(e) => setNewImage(e.target.value)}
                                        placeholder="https://..."
                                        sx={{ mb: 3, '& .MuiInputBase-input': { color: 'white' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }, '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' } }}
                                    />
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<AddCircleIcon />}
                                        onClick={handleAddGift}
                                        sx={{ bgcolor: '#165B33', '&:hover': { bgcolor: '#124a2a' } }}
                                    >
                                        Add to Workshop
                                    </Button>
                                </Paper>
                            </Grid>

                            {/* Inventory Table */}
                            <Grid size={{ xs: 12, md: 8 }}>
                                <Box sx={{ height: 500, width: '100%', bgcolor: 'rgba(0,0,0,0.5)', borderRadius: 2, backdropFilter: 'blur(10px)', p: 2 }}>
                                    <DataGrid
                                        getRowId={(row) => row._id || Math.random()}
                                        rows={gifts}
                                        columns={INVENTORY_COLUMNS}
                                        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
                                        pageSizeOptions={[5, 10]}
                                        sx={{
                                            border: 'none',
                                            color: 'white',
                                            '& .MuiDataGrid-cell': { borderColor: 'rgba(255,255,255,0.1)' },
                                            '& .MuiDataGrid-columnHeaders': { borderColor: 'rgba(255,255,255,0.2)', bgcolor: 'rgba(255,255,255,0.05)' },
                                            '& .MuiTablePagination-root': { color: 'white' }
                                        }}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                )}

            </Container>
        </Box>
    );
}
