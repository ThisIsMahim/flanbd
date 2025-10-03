import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import Rating from '@mui/material/Rating';
import { DataGrid } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearErrors, deleteReview, getAllReviews } from '../../actions/productAction';
import { DELETE_REVIEW_RESET } from '../../constants/productConstants';
import BackdropLoader from '../Layouts/BackdropLoader';
import MetaData from '../Layouts/MetaData';

const ReviewsTable = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [productId, setProductId] = useState("");
    const [editOpen, setEditOpen] = useState(false);
    const [currentReview, setCurrentReview] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const { reviews, loading: reviewsLoading, error } = useSelector((state) => state.reviews);
    const { loading, isDeleted, error: deleteError } = useSelector((state) => state.review);

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }
        if (deleteError) {
            enqueueSnackbar(deleteError, { variant: "error" });
            dispatch(clearErrors());
        }
        if (isDeleted) {
            enqueueSnackbar("Review Deleted Successfully", { variant: "success" });
            dispatch({ type: DELETE_REVIEW_RESET });
            if (productId) {
                dispatch(getAllReviews(productId));
            }
        }
    }, [dispatch, error, deleteError, isDeleted, productId, enqueueSnackbar]);

    const deleteReviewHandler = (id) => {
        dispatch(deleteReview(id, productId));
    };

    const handleEditClick = (review) => {
        setCurrentReview(review);
        setRating(review.rating);
        setComment(review.comment);
        setEditOpen(true);
    };

    const handleEditClose = () => {
        setEditOpen(false);
        setCurrentReview(null);
        setRating(0);
        setComment("");
    };

    const handleEditSubmit = () => {
        // Implement your update review logic here
        enqueueSnackbar("Review updated successfully", { variant: "success" });
        handleEditClose();
    };

    const columns = [
        {
            field: "id",
            headerName: "Review ID",
            minWidth: 200,
            flex: 0.5,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <span className="text-gray-700 font-medium truncate">{params.row.id}</span>
            )
        },
        {
            field: "user",
            headerName: "User",
            minWidth: 150,
            flex: 0.5,
            headerClassName: 'super-app-theme--header',
            valueGetter: (params) => params.row.name || 'Unknown User',
            renderCell: (params) => (
                <span className="text-gray-800 font-medium">{params.row.name || 'Unknown User'}</span>
            )
        },
        {
            field: "rating",
            headerName: "Rating",
            type: "number",
            minWidth: 120,
            flex: 0.3,
            align: "left",
            headerAlign: "left",
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => {
                return <Rating value={params.row.rating} precision={0.5} readOnly size="small" />
            },
        },
        {
            field: "comment",
            headerName: "Comment",
            minWidth: 250,
            flex: 1,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Box sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }} className="text-gray-600">
                    {params.row.comment}
                </Box>
            ),
        },
        {
            field: "createdAt",
            headerName: "Date",
            minWidth: 150,
            flex: 0.4,
            headerClassName: 'super-app-theme--header',
            valueGetter: (params) => new Date(params.row.createdAt).toLocaleDateString(),
            renderCell: (params) => (
                <span className="text-gray-600">{new Date(params.row.createdAt).toLocaleDateString()}</span>
            )
        },
        {
            field: "actions",
            headerName: "Actions",
            minWidth: 200,
            flex: 0.5,
            sortable: false,
            headerClassName: 'super-app-theme--header',
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => deleteReviewHandler(params.row.id)}
                        disabled={loading}
                        sx={{
                            borderRadius: '8px',
                            backgroundColor: '#ef4444',
                            '&:hover': {
                                backgroundColor: '#dc2626',
                            }
                        }}
                    >
                        Delete
                    </Button>
                </Box>
            ),
        },
    ];

    const rows = reviews ? reviews.map((review) => ({
        id: review._id,
        _id: review._id,
        name: review.name || 'Unknown User',
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt || new Date().toISOString(),
    })) : [];

    return (
        <>
            <MetaData title="Admin Reviews | EyeGears" />
            {(loading || reviewsLoading) && <BackdropLoader />}
            
            <Box sx={{ mb: 3 }} className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl">
                <Typography variant="h5" gutterBottom className="text-gray-800 font-medium mb-4">
                    Product Reviews
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        label="Enter Product ID"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        placeholder="65a7e45902e12c44f5994450"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: '#8A39E1',
                                },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#8A39E1',
                            },
                        }}
                    />
                    <Button
                        className='!text-white'
                        variant="contained"
                        onClick={() => {
                            if (productId.length === 24) {
                                dispatch(getAllReviews(productId));
                            } else {
                                enqueueSnackbar('Please enter a valid 24-character Product ID', { variant: 'error' });
                            }
                        }}
                        disabled={reviewsLoading || productId.length !== 24}
                        sx={{ 
                            borderRadius: '8px', 
                            background: 'linear-gradient(45deg, #9333ea 30%, #8A39E1 90%)',
                            boxShadow: '0 3px 10px rgba(138, 57, 225, 0.3)',
                            '&:hover': {
                                boxShadow: '0 5px 15px rgba(138, 57, 225, 0.5)',
                            }
                        }}
                    >
                        Load Reviews
                    </Button>
                </Box>

                <Box sx={{ height: 600, width: '100%', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10, 25, 50]}
                        disableSelectionOnClick
                        loading={reviewsLoading}
                        autoHeight
                        sx={{
                            boxShadow: 0,
                            border: 0,
                            '& .MuiDataGrid-cell': {
                                borderBottom: 'none',
                                display: 'flex',
                                alignItems: 'center',
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: 'rgba(138, 57, 225, 0.08)',
                                borderBottom: 'none',
                            },
                            '& .MuiDataGrid-cell:hover': {
                                color: 'primary.main',
                            },
                            '& .super-app-theme--header': {
                                fontWeight: 'bold',
                                color: '#6b21a8'
                            },
                        }}
                    />
                </Box>
            </Box>

            {/* Edit Review Dialog */}
            <Dialog 
                open={editOpen} 
                onClose={handleEditClose}
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                        padding: '8px'
                    }
                }}
            >
                <DialogTitle className="font-bold text-gray-800 border-b pb-2">Edit Review</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Rating
                            value={rating}
                            onChange={(event, newValue) => setRating(newValue)}
                            precision={0.5}
                            size="large"
                        />
                    </Box>
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Comment"
                        multiline
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: '#8A39E1',
                                },
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#8A39E1',
                            },
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleEditClose} sx={{ color: 'gray', borderRadius: '8px' }}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleEditSubmit} 
                        variant="contained" 
                        sx={{ 
                            borderRadius: '8px', 
                            background: 'linear-gradient(45deg, #9333ea 30%, #8A39E1 90%)',
                            boxShadow: '0 3px 10px rgba(138, 57, 225, 0.3)',
                            '&:hover': {
                                boxShadow: '0 5px 15px rgba(138, 57, 225, 0.5)',
                            }
                        }}
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ReviewsTable;