import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Typography, Button, Card, Form, Input, Select, Table, Space, message, Row, Col } from 'antd';
import { LogoutOutlined, UserAddOutlined, DeleteOutlined, DashboardOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ nome: '', email: '', senha: '', papel: 'usuario' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await axios.get('/api/v1/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.error || err.message || 'Erro ao carregar usuários.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values) => {
    setError('');
    setLoading(true);
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await axios.post('/api/v1/users', values, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      setUsers(prev => [...prev, response.data]);
      setNewUser({ nome: '', email: '', senha: '', papel: 'usuario' });
      
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err.response?.data?.error || err.message || 'Erro ao criar usuário.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`/api/v1/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers(); // Atualiza a lista de usuários
    } catch (err) {
      setError('Erro ao excluir usuário.');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nome', dataIndex: 'nome', key: 'nome' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { 
      title: 'Papel', 
      dataIndex: 'papel', 
      key: 'papel',
      render: (papel) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium
          ${papel === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
          {papel}
        </span>
      )
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="link" 
          danger 
          onClick={() => handleDelete(record.id)}
          icon={<DeleteOutlined />}
        >
          Excluir
        </Button>
      ),
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Header className="fixed w-full z-50 flex justify-between items-center px-8 py-4">
        <Button
          type="primary"
          icon={<DashboardOutlined />}
          size="medium"
          onClick={() => navigate('/dashboard')}
          className="btn-secondary"
        >
          Dashboard
        </Button>
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          size="large"
          onClick={() => navigate('/')}
          className="logout-button-fixed"
        >
          Sair do Sistema
        </Button>
      </Header>

      <Content className="pt-24 px-8 pb-12">
        <div className="dashboard-header animate-fade-in">
          <Title level={1} className="header-title text-center mb-6">
            Gestão de Usuários
          </Title>
          <Text className="text-gray-600 text-lg block text-center mb-12">
            Gerencie os usuários do sistema de forma eficiente
          </Text>
        </div>

        <Card className="shadow-lg mb-8">
          <Title level={3} className="mb-6">Novo Usuário</Title>
          <Form layout="vertical" onFinish={handleCreate} className="max-w-4xl mx-auto">
            <Row gutter={24}>
              <Col span={12}>
                <Form.Item
                  name="nome"
                  label="Nome"
                  rules={[{ required: true, message: 'Por favor, insira o nome' }]}
                >
                  <Input placeholder="Digite o nome" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: 'Por favor, insira o email' },
                    { type: 'email', message: 'Email inválido' }
                  ]}
                >
                  <Input placeholder="Digite o email" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="senha"
                  label="Senha"
                  rules={[{ required: true, message: 'Por favor, insira a senha' }]}
                >
                  <Input.Password placeholder="Digite a senha" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="papel"
                  label="Papel"
                  initialValue="usuario"
                >
                  <Select>
                    <Option value="usuario">Usuário</Option>
                    <Option value="admin">Administrador</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<UserAddOutlined />}
                className="w-full md:w-auto"
              >
                Adicionar Usuário
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card className="shadow-lg">
          <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            className="mb-8"
          />
        </Card>
      </Content>

      <Footer className="text-center">
        <Text className="text-gray-500">
          © {currentYear} Drive360 by Naps Parts & Solutions | Todos os direitos reservados.
        </Text>
      </Footer>
    </Layout>
  );
};

export default Users;
