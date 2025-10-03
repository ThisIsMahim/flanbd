import { Button, Modal, Table, Tag, message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../../utils/LanguageContext';

const UserMessagesPage = () => {
  const { language } = useContext(LanguageContext);
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

  const t = translations[language];

  const statusColors = {
    unread: 'red',
    read: 'blue',
    archived: 'gray',
  };

  const columns = [
    {
      title: t.name,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t.email,
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: t.phone,
      dataIndex: 'phone',
      key: 'phone',
      render: (phone) => phone || '-',
    },
    {
      title: t.subject,
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: t.date,
      dataIndex: 'createdAt',
      key: 'date',
      render: (date) => moment(date).format('lll'),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: t.status,
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={statusColors[status]}>
          {t[status]}
        </Tag>
      ),
      filters: [
        { text: t.unread, value: 'unread' },
        { text: t.read, value: 'read' },
        { text: t.archived, value: 'archived' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: t.actions,
      key: 'actions',
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            className='!bg-blue-500'
            onClick={() => {
              setSelectedMessage(record);
              setIsModalVisible(true);
              if (record.status === 'unread') {
                markAsRead(record._id);
              }
            }}
          >
            {t.view}
          </Button>
          <Button
            danger
            onClick={() => handleDelete(record._id)}
          >
            {t.delete}
          </Button>
          <Button
            onClick={() => updateStatus(record._id, 
              record.status === 'archived' ? 'read' : 'archived'
            )}
          >
            {record.status === 'archived' ? t.read : t.archived}
          </Button>
        </div>
      ),
    },
  ];

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/usermessages`);
      setMessages(data.data);
    } catch (error) {
      message.error(t.fetchError);
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Modal.confirm({
      title: t.deleteConfirm,
      onOk: async () => {
        try {
          await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/usermessages/${id}`);
          message.success(t.deleteSuccess);
          fetchMessages();
        } catch (error) {
          message.error(t.deleteError);
          console.error('Error deleting message:', error);
        }
      },
    });
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/usermessages/${id}/status`,
        { status: 'read' }
      );
      // Optimistically update the local state
      setMessages(messages.map(msg => 
        msg._id === id ? { ...msg, status: 'read' } : msg
      ));
      message.success(t.statusUpdateSuccess);
    } catch (error) {
      message.error(t.statusUpdateError);
      console.error('Error updating status:', error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/usermessages/${id}/status`,
        { status: newStatus }
      );
      // Optimistically update the local state
      setMessages(messages.map(msg => 
        msg._id === id ? { ...msg, status: newStatus } : msg
      ));
      message.success(t.statusUpdateSuccess);
    } catch (error) {
      message.error(t.statusUpdateError);
      console.error('Error updating status:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{t.title}</h1>
      
      <Table
        columns={columns}
        dataSource={messages}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: t.noMessages }}
        scroll={{ x: true }}
      />

      <Modal
        title={selectedMessage?.subject}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            {t.close}
          </Button>,
        ]}
        width={800}
      >
        {selectedMessage && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">{t.name}</p>
                <p>{selectedMessage.name}</p>
              </div>
              <div>
                <p className="font-semibold">{t.email}</p>
                <p>{selectedMessage.email}</p>
              </div>
              {selectedMessage.phone && (
                <div>
                  <p className="font-semibold">{t.phone}</p>
                  <p>{selectedMessage.phone}</p>
                </div>
              )}
              <div>
                <p className="font-semibold">{t.status}</p>
                <p>
                  <Tag color={statusColors[selectedMessage.status]}>
                    {t[selectedMessage.status]}
                  </Tag>
                </p>
              </div>
              <div>
                <p className="font-semibold">{t.date}</p>
                <p>{moment(selectedMessage.createdAt).format('lll')}</p>
              </div>
            </div>
            <div>
              <p className="font-semibold">{t.subject}</p>
              <p>{selectedMessage.subject}</p>
            </div>
            <div>
              <p className="font-semibold">{t.message}</p>
              <p className="whitespace-pre-line bg-gray-50 p-4 rounded">
                {selectedMessage.message}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserMessagesPage;