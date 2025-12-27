'use client';

import React from 'react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, Box, AppBar, Toolbar, IconButton, Chip, Tabs, Tab, TextField, Button, Grid, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Snowfall from '@/components/Snowfall';
import { useGift } from '@/context/GiftContext';
import { useAuth } from '@/context/AuthContext';
import santaApi from '@/services/santaApi';
import { DataGrid, GridColDef, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import Checkbox from '@mui/material/Checkbox';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';


const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


interface Letter {
    _id?: string;
    childName: string;
    location: string;
    wishList?: string;
    gift?: {
        _id: string;
        title: string;
        image: string;
    };
    giftId?: string;
    status: 'Nice' | 'Naughty' | 'Sorting';
    isPacked: boolean;
    content?: string;
    popularity?: number;
}

// --- Letters Tab Data ---
const LETTER_COLUMNS = (
    handleViewLetter: (letter: Letter) => void,
    handlePackedToggle: (id: string, isPacked: boolean) => void,
    handleStatusChange: (id: string, status: string) => void
): GridColDef[] => [
        { field: 'childName', headerName: 'Child Name', width: 180 },
        { field: 'location', headerName: 'Location', width: 150 },
        {
            field: 'gift',
            headerName: 'Requested Gift',
            width: 250,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, height: '100%' }}>
                    <Box
                        component="img"
                        src={params.value?.image || 'https://via.placeholder.com/40'}
                        sx={{ width: 35, height: 35, borderRadius: 1, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.2)' }}
                    />
                    <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{params.value?.title || 'No Gift'}</Typography>
                </Box>
            )
        },
        {
            field: 'isPacked',
            headerName: 'Packed',
            width: 100,
            renderCell: (params) => (
                <Checkbox
                    checked={params.value}
                    onChange={(e) => handlePackedToggle(params.row._id, e.target.checked)}
                    sx={{ color: 'white', '&.Mui-checked': { color: '#165B33' } }}
                />
            )
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => {
                const colors: Record<string, string> = { Nice: 'success', Naughty: 'error', Sorting: 'warning' };
                const color = colors[params.value] || 'warning';
                return (
                    <Chip
                        label={params.value}
                        color={color as any}
                        size="small"
                        variant="outlined"
                        onClick={() => {
  if (params.value === 'Sorting') return; // Don't allow manual override
}}
                        sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
                    />
                );
            }
        },
        {
            field: 'action',
            headerName: 'Letter',
            width: 120,
            renderCell: (params) => (
                <Button
                    size="small"
                    onClick={() => handleViewLetter(params.row)}
                    sx={{ color: '#F8B229', textTransform: 'none', '&:hover': { bgcolor: 'rgba(248,178,41,0.1)' } }}
                >
                    View
                </Button>
            )
        }
    ];

// --- Inventory Tab Data ---
const getInventoryColumns = (
    handleUpdateStock: (id: string, currentStock: number) => void
): GridColDef[] => [
        {
            field: 'image',
            headerName: 'Image',
            width: 100,
            renderCell: (params) => <Box component="img" src={params.value} sx={{ width: 50, height: 50, borderRadius: 1, objectFit: 'cover' }} />
        },
        { field: 'title', headerName: 'Gift Title', width: 250 },
        { field: 'stock', headerName: 'Stock', width: 120, renderCell: (params) => params.value ?? 0 },
        {
            field: 'action',
            headerName: 'Action',
            width: 150,
            renderCell: (params) => (
                <Button
                    size="small"
                    onClick={() => handleUpdateStock(params.row._id, params.row.stock || 0)}
                    sx={{ color: '#F8B229', textTransform: 'none' }}
                >
                    Update Stock
                </Button>
            )
        }
    ];


export default function SantaDashboard() {
    const [tabValue, setTabValue] = useState(0);
    const { gifts, addGift } = useGift();
    const { santa, loading: authLoading, logoutSanta } = useAuth();
    const router = useRouter();
    const [letters, setLetters] = useState<Letter[]>([]);
    const [totalLetters, setTotalLetters] = useState(0);
    const [loading, setLoading] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);

    useEffect(() => {
        if (!authLoading && !santa) {
            router.replace('/santa/login');
        }
    }, [santa, authLoading, router]);

    // DataGrid States
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 5,
    });
    const [selectedSort, setSelectedSort] = useState('latest');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedGift, setSelectedGift] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State
    const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
    const [modalOpen, setModalOpen] = useState(false);

    // Stock Modal State
const [stockModalOpen, setStockModalOpen] = useState(false);
const [stockGiftId, setStockGiftId] = useState<string | null>(null);
const [stockValue, setStockValue] = useState('');


    const handlePackedToggle = useCallback(async (id: string, isPacked: boolean) => {
        try {
            await santaApi.patch(`/letters/${id}/packed`, { isPacked });
            setLetters(prev => prev.map(l => l._id === id ? { ...l, isPacked } : l));
        } catch (error) {
            console.error('Error updating packed status:', error);
        }
    }, []);

    const handleStatusChange = useCallback(async (id: string, status: string) => {
        try {
            await santaApi.patch(`/letters/${id}/status`, { status });
            setLetters(prev => prev.map(l => l._id === id ? { ...l, status: status as any } : l));
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }, []);

    const handleViewLetter = useCallback((letter: Letter) => {
        setSelectedLetter(letter);
        setModalOpen(true);
    }, []);

    const { updateGiftStock } = useGift();
    const handleUpdateStock = useCallback((id: string, currentStock: number) => {
  setStockGiftId(id);
  setStockValue(currentStock.toString());
  setStockModalOpen(true);
}, []);


const confirmStockUpdate = async () => {
  if (!stockGiftId) return;

  const newStock = parseInt(stockValue);
  if (isNaN(newStock)) return;

  await updateGiftStock(stockGiftId, newStock);
  setStockModalOpen(false);
};

    const columns = useMemo(() => LETTER_COLUMNS(handleViewLetter, handlePackedToggle, handleStatusChange), [handleViewLetter, handlePackedToggle, handleStatusChange]);
    const inventoryColumns = useMemo(() => getInventoryColumns(handleUpdateStock), [handleUpdateStock]);

    useEffect(() => {
        if (!santa) return;

        let active = true;
        const load = async () => {
            setLoading(true);
            try {
                let sortBy = 'createdAt';
                let sortOrder: 'asc' | 'desc' = 'desc';

                if (selectedSort === 'top') {
                    sortBy = 'popularity';
                    sortOrder = 'desc';
                } else if (selectedSort === 'oldest') {
                    sortBy = 'createdAt';
                    sortOrder = 'asc';
                }

                const response = await santaApi.get('/letters', {
                    params: {
                        page: paginationModel.page + 1,
                        limit: paginationModel.pageSize,
                        search: searchQuery,
                        sortBy,
                        sortOrder,
                        status: selectedStatus,
                        gift: selectedGift
                    }
                });

                if (active) {
                    setLetters(response.data.letters);
                    setTotalLetters(response.data.pagination.total);
                }
            } catch (error) {
                console.error('Error loading letters:', error);
            } finally {
                if (active) setLoading(false);
            }
        };

        load();
        return () => { active = false; };
    }, [paginationModel, selectedSort, searchQuery, selectedStatus, selectedGift, santa]);

    const [newTitle, setNewTitle] = useState('');
    const [newImage, setNewImage] = useState('');
    const [newStock, setNewStock] = useState('0');

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleAddGift = async () => {
        if (newTitle && newImage) {
            await addGift({ title: newTitle, image: newImage, stock: parseInt(newStock) || 0 });
            setNewTitle('');
            setNewImage('');
            setNewStock('0');
            setToastOpen(true);

        }
    };

    if (authLoading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h5" sx={{ color: 'white' }}>Loading...</Typography>
            </Box>
        );
    }

    if (!santa) {
        return null; // Will redirect
    }

    return (
        <Box sx={{ position: 'relative', overflowX: 'hidden', minHeight: '100vh', scrollbarWidth: 'none' }}>
            <Snowfall />

            <AppBar position="static" color="transparent" elevation={0} sx={{ pt: 2, bgcolor: 'rgba(5, 10, 24, 0.8)' }}>
                <Toolbar>
                    <Typography variant="h5" sx={{ flexGrow: 1, color: '#D42426', fontFamily: 'var(--font-mountains)' }}>
                        Santa's Command Center
                    </Typography>

                    <IconButton onClick={logoutSanta} sx={{ color: 'white' }}>
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>

                <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ '& .MuiTab-root': { color: 'rgba(255,255,255,0.7)' }, '& .Mui-selected': { color: '#F8B229' }, '& .MuiTabs-indicator': { bgcolor: '#F8B229' } }}>
                    <Tab label="Letters" />
                    <Tab label="Workshop Inventory" />
                </Tabs>
            </AppBar>

            <Container maxWidth="lg" sx={{ py: 4 }}>
                {tabValue === 0 && (
                    <Box>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 4 }}>
                            <Typography variant="h4" sx={{ color: 'white', fontFamily: 'var(--font-inter)', flexGrow: 1 }}>
                                Incoming Letters
                            </Typography>

                            <FormControl size="small" sx={{ width: 160, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Sort By</InputLabel>
                                <Select
                                    value={selectedSort}
                                    label="Sort By"
                                    onChange={(e) => setSelectedSort(e.target.value)}
                                    sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
                                >
                                    <MenuItem value="top">Top Requested</MenuItem>
                                    <MenuItem value="latest">Latest First</MenuItem>
                                    <MenuItem value="oldest">Oldest First</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl size="small" sx={{ width: 160, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Filter Status</InputLabel>
                                <Select
                                    value={selectedStatus}
                                    label="Filter Status"
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
                                >
                                    <MenuItem value="">All Statuses</MenuItem>
                                    <MenuItem value="Nice">✨ Nice</MenuItem>
                                    <MenuItem value="Naughty">👹 Naughty</MenuItem>
                                    <MenuItem value="Sorting">⏳ Sorting</MenuItem>
                                </Select>
                            </FormControl>

                            {/* <FormControl size="small" sx={{ width: 200, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                                <InputLabel sx={{ color: 'rgba(255,255,255,0.7)' }}>Filter Gift</InputLabel>
                                <Select
                                    value={selectedGift}
                                    label="Filter Gift"
                                    onChange={(e) => setSelectedGift(e.target.value)}
                                    sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
                                >
                                    <MenuItem value="">All Gifts</MenuItem>
                                    {gifts.map((gift) => (
                                        <MenuItem key={gift._id} value={gift._id}>
                                            🎁 {gift.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl> */}

                            <TextField
                                size="small"
                                placeholder="Search by child name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                sx={{
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    borderRadius: 1,
                                    width: 300,
                                    '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }
                                }}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon sx={{ color: 'rgba(255,255,255,0.5)' }} />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        </Box>

                        <Box sx={{ height: 600, width: '100%', bgcolor: 'rgba(0,0,0,0.5)', borderRadius: 2, backdropFilter: 'blur(10px)', p: 2 }}>
                            <DataGrid
                                getRowId={(row) => row._id || Math.random()}
                                rows={letters}
                                columns={columns}
                                loading={loading}
                                paginationMode="server"
                                rowCount={totalLetters}
                                paginationModel={paginationModel}
                                onPaginationModelChange={setPaginationModel}
                                pageSizeOptions={[5, 10, 25]}
                                disableColumnFilter
                                disableColumnMenu
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

                {tabValue === 1 && (
                    <Box>
                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Paper sx={{ p: 4, bgcolor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', color: 'white', borderRadius: 2 }}>
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
                                    <TextField
                                        fullWidth
                                        label="Initial Stock"
                                        type="number"
                                        variant="outlined"
                                        value={newStock}
                                        onChange={(e) => setNewStock(e.target.value)}
                                        sx={{ mb: 3, '& .MuiInputBase-input': { color: 'white' }, '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' }, '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' } }}
                                    />
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<AddCircleIcon />}
                                        onClick={handleAddGift}
                                        sx={{ bgcolor: '#165B33', '&:hover': { bgcolor: '#124a2a' }, py: 1.5, fontWeight: 'bold' }}
                                    >
                                        Add to Workshop
                                    </Button>
                                </Paper>
                            </Grid>

                            <Grid size={{ xs: 12, md: 8 }}>
                                <Box sx={{ height: 500, width: '100%', bgcolor: 'rgba(0,0,0,0.5)', borderRadius: 2, backdropFilter: 'blur(10px)', p: 2 }}>
                                    <DataGrid
                                        getRowId={(row) => row._id || Math.random()}
                                        rows={gifts}
                                        columns={inventoryColumns}
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

            {/* Letter Modal */}
            <Modal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}
            >
                <Box sx={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: 500,
                    bgcolor: '#f4e4bc', // Aged paper color
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 1,
                    backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)',
                    backgroundSize: '20px 20px',
                    color: '#2c1e14',
                    fontFamily: '"Cormorant Garamond", serif',
                    border: '10px solid #165B33',
                    maxHeight: '80vh',
                    overflowY: 'auto'
                }}>
                    <IconButton
                        onClick={() => setModalOpen(false)}
                        sx={{ position: 'absolute', right: 8, top: 8, color: '#D42426' }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Typography variant="h4" sx={{ mb: 2, color: '#D42426', textAlign: 'center', fontWeight: 'bold' }}>
                        Dear Santa,
                    </Typography>

                    <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, fontSize: '1.2rem', fontStyle: 'italic' }}>
                        {selectedLetter?.content || "I've been very good this year! Please bring me my gift!"}
                    </Typography>

                    <Box sx={{ borderTop: '2px dashed rgba(0,0,0,0.1)', pt: 2, mt: 4 }}>
                        <Typography variant="body1">
                            <strong>From:</strong> {selectedLetter?.childName}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Location:</strong> {selectedLetter?.location}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Requested:</strong> {selectedLetter?.gift?.title || 'Unknown'}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <img src="/santa-seal.png" alt="Santa Seal" style={{ width: 80, opacity: 0.8 }} />
                    </Box>
                </Box>
            </Modal>


            <Modal
  open={stockModalOpen}
  onClose={() => setStockModalOpen(false)}
  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
>
  <Box
    sx={{
      width: 320,
      bgcolor: 'rgba(15, 25, 45, 0.95)',
      borderRadius: 3,
      p: 4,
      border: '2px solid #F8B229',
      boxShadow: '0 0 30px rgba(248,178,41,0.3)',
      color: 'white',
      textAlign: 'center',
      backdropFilter: 'blur(10px)',
    }}
  >
    <Typography variant="h6" sx={{ mb: 2, color: '#F8B229', fontWeight: 'bold' }}>
      🎁 Update Gift Stock
    </Typography>

    <TextField
      type="number"
      fullWidth
      value={stockValue}
      onChange={(e) => setStockValue(e.target.value)}
      sx={{
        mb: 3,
        '& input': { color: 'white', textAlign: 'center', fontSize: 18 },
        '& label': { color: 'rgba(255,255,255,0.7)' },
        '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
      }}
    />

    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button
        fullWidth
        variant="outlined"
        onClick={() => setStockModalOpen(false)}
        sx={{ color: '#F8F3E6', borderColor: '#F8F3E6' }}
      >
        Cancel
      </Button>

      <Button
        fullWidth
        variant="contained"
        onClick={confirmStockUpdate}
        sx={{
          bgcolor: '#165B33',
          '&:hover': { bgcolor: '#124a2a' },
          fontWeight: 'bold',
        }}
      >
        Save
      </Button>
    </Box>
  </Box>
</Modal>


            <Snackbar
  open={toastOpen}
  autoHideDuration={3500}
  onClose={() => setToastOpen(false)}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
>
  <Alert
    onClose={() => setToastOpen(false)}
    severity="success"
    sx={{
      bgcolor: '#165B33',
      color: '#F8F3E6',
      fontWeight: 'bold',
      border: '1px solid #F8B229',
      boxShadow: '0 0 20px rgba(248,178,41,0.5)',
      fontFamily: 'var(--font-inter)',
    }}
    icon={false}
  >
    🎄 Gift successfully added to Santa's workshop!
  </Alert>
</Snackbar>
        </Box>
    );
}

