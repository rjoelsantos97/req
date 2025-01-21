import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import { Layout, Typography, Button, Table, Space, Card, message, Input } from 'antd';
import { LogoutOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import RequestDetails from '../components/RequestDetails';

const { Content } = Layout;
const { Title, Text } = Typography;

const Requests = ({ onEditRequest, onDeleteRequest, refresh, userRole }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchRequests();
  }, [refresh]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('/api/v1/requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(response.data);
    } catch (err) {
      message.error('Erro ao carregar requisições');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`/api/v1/requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Requisição excluída com sucesso!');
      fetchRequests(); // Atualiza a lista de requisições
    } catch (err) {
      message.error('Erro ao excluir requisição.');
    }
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Buscar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            size="small"
            style={{ width: 90 }}
          >
            Buscar
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Limpar
          </Button>
        </Space>
      </div>
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
  });

  const categorias = ['Materiais', 'Serviços', 'Equipamentos', 'Outros']; // Adicione suas categorias
  const statusOptions = ['Pendente', 'Em Análise', 'Aprovado', 'Rejeitado']; // Adicione seus status

  const columns = [
    { 
      title: 'ID', 
      dataIndex: 'id', 
      key: 'id',
      ...getColumnSearchProps('id')
    },
    { 
      title: 'Número', 
      dataIndex: 'numero', 
      key: 'numero',
      ...getColumnSearchProps('numero')
    },
    { 
      title: 'Categoria', 
      dataIndex: 'categoria', 
      key: 'categoria',
      filters: categorias.map(cat => ({ text: cat, value: cat })),
      onFilter: (value, record) => record.categoria === value,
    },
    { 
      title: 'Departamento', 
      dataIndex: 'departamento', 
      key: 'departamento',
      ...getColumnSearchProps('departamento')
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      filters: statusOptions.map(status => ({ text: status, value: status })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedRequest(record);
              setDetailsVisible(true);
            }}
          >
            Ver
          </Button>
          {userRole === 'admin' && (
            <>
              <Button 
                type="link" 
                icon={<EditOutlined />}
                onClick={() => navigate(`/requests/edit/${record.id}`)}
              >
                Editar
              </Button>
              <Button 
                type="link" 
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.id)}
              >
                Excluir
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Layout className="min-h-screen">
      

      <Content className="pt-24 px-8 pb-12">
        <div className="dashboard-header animate-fade-in">
          <Title level={1} className="header-title text-center mb-6">
            Gestão de Requisições
          </Title>
          <Text className="text-gray-600 text-lg block text-center mb-12">
            Visualize e gerencie todas as requisições
          </Text>
        </div>

        <Card className="shadow-lg">
          <Table
            columns={columns}
            dataSource={requests}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </Content>


      <RequestDetails
        request={selectedRequest}
        visible={detailsVisible}
        onClose={() => {
          setDetailsVisible(false);
          setSelectedRequest(null);
        }}
      />
      
    </Layout>
  );
};

export default Requests;