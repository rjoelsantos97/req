import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Typography, Button, Card, Form, Input, Table, Space, message, Row, Col, Breadcrumb, Spin, Input as AntInput } from 'antd';
import { LogoutOutlined, HomeOutlined, DeleteOutlined, EditOutlined, DashboardOutlined, SearchOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import RoleBasedElement from '../components/RoleBasedElement';
import '../index.css';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [newWarehouse, setNewWarehouse] = useState({ nome: '', codigo: '' });
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('/api/v1/warehouses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWarehouses(response.data);
    } catch (err) {
      message.error('Erro ao carregar armazéns.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormVisibility = () => {
    setIsFormVisible(true);
    setEditingWarehouse(null);
    form.resetFields();
  };

  const handleFormCancel = () => {
    setIsFormVisible(false);
    setEditingWarehouse(null);
    form.resetFields();
  };

  const handleCreate = async (values) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post('/api/v1/warehouses', values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Armazém criado com sucesso!');
      setIsFormVisible(false);
      form.resetFields();
      fetchWarehouses();
    } catch (err) {
      message.error('Erro ao criar armazém.');
    }
  };

  const handleUpdate = async (values) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`/api/v1/warehouses/${editingWarehouse.id}`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingWarehouse(null);
      fetchWarehouses();
    } catch (err) {
      setError('Erro ao atualizar armazém.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`/api/v1/warehouses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchWarehouses();
    } catch (err) {
      setError('Erro ao excluir armazém.');
    }
  };

  const filteredWarehouses = warehouses.filter(warehouse => 
    warehouse.nome.toLowerCase().includes(searchText.toLowerCase()) ||
    warehouse.codigo.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nome', dataIndex: 'nome', key: 'nome' },
    { title: 'Código', dataIndex: 'codigo', key: 'codigo' },
    {
      title: 'Status',
      key: 'status',
      render: () => (
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
          Ativo
        </span>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <RoleBasedElement allowedRoles={['admin']}>
          <Space>
            <Button 
              type="link" 
              onClick={() => setEditingWarehouse(record)}
              icon={<EditOutlined />}
            >
              Editar
            </Button>
            <Button 
              type="link" 
              danger 
              onClick={() => handleDelete(record.id)}
              icon={<DeleteOutlined />}
            >
              Excluir
            </Button>
          </Space>
        </RoleBasedElement>
      ),
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Header className="fixed w-full z-50 flex justify-between items-center px-8 py-4">
        <div className="flex items-center gap-4">
          <Button
            type="primary"
            icon={<DashboardOutlined />}
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
          >
            Dashboard
          </Button>
          <Breadcrumb>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Gestão</Breadcrumb.Item>
            <Breadcrumb.Item>Armazéns</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={() => navigate('/')}
          className="logout-button-fixed"
        >
          Sair
        </Button>
      </Header>

      <Content className="pt-24 px-8 pb-12">
        <Card className="mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <Title level={2} className="mb-0">Gestão de Armazéns</Title>
              <Text className="text-gray-600">Gerencie todos os armazéns do sistema</Text>
            </div>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchWarehouses}
                loading={loading}
              >
                Atualizar
              </Button>
              <RoleBasedElement allowedRoles={['admin']}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleFormVisibility}
                >
                  Novo Armazém
                </Button>
              </RoleBasedElement>
            </Space>
          </div>

          <div className="mb-6">
            <Input
              prefix={<SearchOutlined className="text-gray-400" />}
              placeholder="Pesquisar armazéns..."
              onChange={e => setSearchText(e.target.value)}
              className="max-w-md"
              allowClear
            />
          </div>

          <RoleBasedElement allowedRoles={['admin']}>
            {(isFormVisible || editingWarehouse) && (
              <Card className="mb-6 border-blue-200 bg-blue-50">
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={editingWarehouse ? handleUpdate : handleCreate}
                  initialValues={editingWarehouse || {}}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="nome"
                        label="Nome"
                        rules={[{ required: true, message: 'Nome é obrigatório' }]}
                      >
                        <Input prefix={<HomeOutlined className="text-gray-400" />} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="codigo"
                        label="Código"
                        rules={[{ required: true, message: 'Código é obrigatório' }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item className="mb-0">
                    <Space>
                      <Button type="primary" htmlType="submit">
                        {editingWarehouse ? 'Salvar Alterações' : 'Criar Armazém'}
                      </Button>
                      <Button onClick={handleFormCancel}>
                        Cancelar
                      </Button>
                    </Space>
                  </Form.Item>
                </Form>
              </Card>
            )}
          </RoleBasedElement>

          <Table
            columns={columns}
            dataSource={filteredWarehouses}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total de ${total} armazéns`,
            }}
            className="shadow-sm"
            scroll={{ x: 800 }}
          />
        </Card>
      </Content>

      <Footer className="text-center bg-transparent">
        <Text className="text-gray-500">
          © {currentYear} Drive360 by Naps Parts & Solutions
        </Text>
      </Footer>
    </Layout>
  );
};

export default Warehouses;
