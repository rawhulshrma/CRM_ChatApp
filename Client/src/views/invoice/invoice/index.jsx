import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Input, Button, Table, Space, Typography, Card, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import { invoiceActions } from '../../../action/invoice/invoiceAction';
import { format } from 'date-fns';
import styled from 'styled-components';
import Badge from './Badge.jsx';

const { Title } = Typography;

const StyledCard = styled(Card)`
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const StyledTable = styled(Table)`
  .ant-table {
    background: #fff;
    border-radius: 8px;
  }
`;

const InvoiceList = () => {
  const dispatch = useDispatch();
  const { invoices = [], loading, error } = useSelector((state) => state.invoice);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(invoiceActions.fetchAll());
  }, [dispatch]);

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleAddNew = () => {
    window.location.href = '/invoice/create';
  };

  const filteredInvoices = Array.isArray(invoices)
    ? invoices.filter((invoice) =>
        invoice?.client?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const getStatusColor = (status) => {
    if (status?.toLowerCase() === 'sent') {
      return '#52c41a'; // green
    } else if (status?.toLowerCase() === 'pending') {
      return '#f5222d'; // red
    } else {
      return '#1890ff'; // blue (default)
    }
  };

  const getPaymentColor = (payment) => {
    if (payment?.toLowerCase() === 'paid') {
      return '#52c41a'; // green
    } else if (payment?.toLowerCase() === 'unpaid') {
      return '#f5222d'; // red
    } else {
      return '#1890ff'; // blue (default)
    }
  };

  const columns = [
    {
      title: 'Number',
      dataIndex: 'number',
      key: 'number',
      sorter: (a, b) => a.number.localeCompare(b.number),
    },
    {
      title: 'Client',
      dataIndex: 'client',
      key: 'client',
      sorter: (a, b) => a.client.localeCompare(b.client),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => (date ? format(new Date(date), 'dd-MM-yyyy') : 'N/A'),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: 'Expired Date',
      dataIndex: 'expire_date',
      key: 'expire_date',
      render: (date) => (date ? format(new Date(date), 'dd-MM-yyyy') : 'N/A'),
      sorter: (a, b) => new Date(a.expire_date) - new Date(b.expire_date),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: 'Paid',
      dataIndex: 'paid',
      key: 'paid',
      sorter: (a, b) => a.paid - b.paid,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge color={getStatusColor(status)} text={status || 'N/A'} />
      ),
      filters: [
        { text: 'Sent', value: 'sent' },
        { text: 'Pending', value: 'pending' },
      ],
      onFilter: (value, record) => record.status && record.status.toLowerCase() === value,
    },
    {
      title: 'Payment',
      dataIndex: 'payment',
      key: 'payment',
      render: (payment) => (
        <Badge color={getPaymentColor(payment)} text={payment || 'N/A'} />
      ),
      filters: [
        { text: 'Paid', value: 'paid' },
        { text: 'Unpaid', value: 'unpaid' },
      ],
      onFilter: (value, record) => record.payment && record.payment.toLowerCase() === value,
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      sorter: (a, b) => (a.createdBy && b.createdBy) ? a.createdBy.localeCompare(b.createdBy) : 0,
    },
  ];

  return (
    <StyledCard>
      <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
        <Col>
          <Title level={2}>Invoice List</Title>
        </Col>
        <Col>
          <Space>
            <Input
              placeholder="Search by client"
              prefix={<SearchOutlined />}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 200 }}
            />
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={() => dispatch(invoiceActions.fetchAll())}
              loading={loading}
            >
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAddNew}
            >
              New Invoice
            </Button>
          </Space>
        </Col>
      </Row>
      {error && <div style={{ color: 'red', marginBottom: '16px' }}>Error: {error}</div>}
      <StyledTable
        columns={columns}
        dataSource={filteredInvoices}
        rowKey="number"
        loading={loading}
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`
        }}
        scroll={{ x: 'max-content' }}
      />
    </StyledCard>
  );
};

export default InvoiceList;