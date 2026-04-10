import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  Paper
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
  Unarchive as UnarchiveIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import { LanguageContext } from '../../utils/LanguageContext';
import BackdropLoader from '../Layouts/BackdropLoader';

const UserMessagesPage = () => {
  const { language } = useContext(LanguageContext);
  const { enqueueSnackbar } = useSnackbar();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const translations = {
    english: {
      title: 'User Messages',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      subject: 'Subject',
      message: 'Message',
      date: 'Date',
      status: 'Status',
      actions: 'Actions',
      view: 'View',
      delete: 'Delete',
      unread: 'Unread',
      read: 'Read',
      archived: 'Archived',
      noMessages: 'No messages found',
      deleteConfirm: 'Are you sure you want to delete this message?',
      deleteSuccess: 'Message deleted successfully',
      deleteError: 'Failed to delete message',
      fetchError: 'Failed to fetch messages',
      statusUpdateSuccess: 'Status updated successfully',
      statusUpdateError: 'Failed to update status',
      close: 'Close',
    },
    bangla: {
      title: 'ব্যবহারকারীর বার্তা',
      name: 'নাম',
      email: 'ইমেইল',
      phone: 'ফোন',
      subject: 'বিষয়',
      message: 'বার্তা',
      date: 'তারিখ',
      status: 'স্ট্যাটাস',
      actions: 'ক্রিয়া',
      view: 'দেখুন',
      delete: 'মুছুন',
      unread: 'অপঠিত',
      read: 'পঠিত',
      archived: 'আর্কাইভড',
      noMessages: 'কোন বার্তা পাওয়া যায়নি',
      deleteConfirm: 'আপনি কি নিশ্চিত এই বার্তা মুছতে চান?',
      deleteSuccess: 'বার্তা সফলভাবে মুছে ফেলা হয়েছে',
      deleteError: 'বার্তা মুছতে ব্যর্থ হয়েছে',
      fetchError: 'বার্তা আনতে ব্যর্থ হয়েছে',
      statusUpdateSuccess: 'স্ট্যাটাস সফলভাবে আপডেট হয়েছে',
      statusUpdateError: 'স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে',
      close: 'বন্ধ',
    },
  };

  const t = translations[language] || translations.english;

  const statusColors = {
    unread: 'error',
    read: 'info',
    archived: 'default',
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/usermessages`);
      setMessages(data.data);
    } catch (error) {
      enqueueSnackbar(t.fetchError, { variant: 'error' });
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t.deleteConfirm)) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/usermessages/${id}`);
        enqueueSnackbar(t.deleteSuccess, { variant: 'success' });
        fetchMessages();
      } catch (error) {
        enqueueSnackbar(t.deleteError, { variant: 'error' });
        console.error('Error deleting message:', error);
      }
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/usermessages/${id}/status`,
        { status: newStatus }
      );
      setMessages(messages.map(msg =>
        msg._id === id ? { ...msg, status: newStatus } : msg
      ));
      enqueueSnackbar(t.statusUpdateSuccess, { variant: 'success' });
    } catch (error) {
      enqueueSnackbar(t.statusUpdateError, { variant: 'error' });
      console.error('Error updating status:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const columns = [
    {
      field: 'name',
      headerName: t.name,
      minWidth: 150,
      flex: 0.5,
    },
    {
      field: 'email',
      headerName: t.email,
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'subject',
      headerName: t.subject,
      minWidth: 200,
      flex: 1,
    },
    {
      field: 'createdAt',
      headerName: t.date,
      minWidth: 180,
      flex: 0.8,
      renderCell: (params) => moment(params.value).format('lll'),
    },
    {
      field: 'status',
      headerName: t.status,
      minWidth: 120,
      flex: 0.5,
      renderCell: (params) => (
        <Chip
          label={t[params.value] || params.value}
          color={statusColors[params.value]}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'actions',
      headerName: t.actions,
      minWidth: 200,
      flex: 1,
      sortable: false,
      renderCell: (params) => {
        const record = params.row;
        return (
          <Box className="flex gap-2">
            <Tooltip title={t.view}>
              <IconButton
                color="primary"
                onClick={() => {
                  setSelectedMessage(record);
                  setIsModalVisible(true);
                  if (record.status === 'unread') {
                    updateStatus(record._id, 'read');
                  }
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title={record.status === 'archived' ? t.read : t.archived}>
              <IconButton
                onClick={() => updateStatus(record._id, record.status === 'archived' ? 'read' : 'archived')}
              >
                {record.status === 'archived' ? <UnarchiveIcon fontSize="small" /> : <ArchiveIcon fontSize="small" />}
              </IconButton>
            </Tooltip>

            <Tooltip title={t.delete}>
              <IconButton
                color="error"
                onClick={() => handleDelete(record._id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <Box className="p-6">
      <Typography variant="h4" className="font-bold mb-6">
        {t.title}
      </Typography>

      <Paper elevation={0} variant="outlined">
        <DataGrid
          rows={messages}
          columns={columns}
          getRowId={(row) => row._id}
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          autoHeight
          loading={loading}
          disableSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell:focus': { outline: 'none' },
          }}
          localeText={{
            noRowsLabel: t.noMessages,
          }}
        />
      </Paper>

      <Dialog
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {selectedMessage?.subject}
          <IconButton onClick={() => setIsModalVisible(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedMessage && (
            <Box className="space-y-6 py-2">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary" className="uppercase font-bold tracking-wider">
                    {t.name}
                  </Typography>
                  <Typography variant="body1">{selectedMessage.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary" className="uppercase font-bold tracking-wider">
                    {t.email}
                  </Typography>
                  <Typography variant="body1">{selectedMessage.email}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary" className="uppercase font-bold tracking-wider">
                    {t.phone}
                  </Typography>
                  <Typography variant="body1">{selectedMessage.phone || '-'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="textSecondary" className="uppercase font-bold tracking-wider">
                    {t.status}
                  </Typography>
                  <Box mt={0.5}>
                    <Chip
                      label={t[selectedMessage.status]}
                      color={statusColors[selectedMessage.status]}
                      size="small"
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="textSecondary" className="uppercase font-bold tracking-wider">
                    {t.date}
                  </Typography>
                  <Typography variant="body1">{moment(selectedMessage.createdAt).format('LLLL')}</Typography>
                </Grid>
              </Grid>

              <Box>
                <Typography variant="caption" color="textSecondary" className="uppercase font-bold tracking-wider">
                  {t.message}
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: 'grey.50', whiteSpace: 'pre-line' }}>
                  {selectedMessage.message}
                </Paper>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setIsModalVisible(false)}
            variant="contained"
            disableElevation
            sx={{ borderRadius: 2 }}
          >
            {t.close}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserMessagesPage;