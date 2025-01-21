import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layout, Typography, Button, Card, Form, Input, Table, Space, message } from 'antd';
import { LogoutOutlined, EditOutlined, DeleteOutlined, SaveOutlined, DashboardOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import RoleBasedElement from '../components/RoleBasedElement';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetchSuppliers();
  }, []); // Empty dependency array ensures this runs only once

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('/api/v1/suppliers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuppliers(response.data);
    } catch (err) {
      message.error('Erro ao carregar fornecedores');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.post('/api/v1/suppliers', values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Fornecedor criado com sucesso!');
      form.resetFields();
      fetchSuppliers();
    } catch (err) {
      message.error('Erro ao criar fornecedor');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`/api/v1/suppliers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Fornecedor excluído com sucesso!');
      fetchSuppliers();
    } catch (err) {
      message.error('Erro ao excluir fornecedor');
    }
  };

  const handleUpdate = async (values) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`/api/v1/suppliers/${editingKey}`, values, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Fornecedor atualizado com sucesso!');
      setEditingKey('');
      fetchSuppliers();
    } catch (err) {
      message.error('Erro ao atualizar fornecedor');
    }
  };

  const columns = [
    { title: 'Nome', dataIndex: 'nome', key: 'nome' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Telefone', dataIndex: 'telefone', key: 'telefone' },
    { title: 'NIF', dataIndex: 'nif', key: 'nif' },
    { title: 'Morada', dataIndex: 'morada', key: 'morada' },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingKey(record.id);
              form.setFieldsValue(record);
            }}
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
        </Space>
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
          onClick={() => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userRole');
            navigate('/');
          }}
        >
          Sair
        </Button>
      </Header>

      <Content className="pt-24 px-8 pb-12">
        <div className="dashboard-header animate-fade-in">
          <Title level={1} className="header-title text-center mb-6">
            Gestão de Fornecedores
          </Title>
          <Text className="text-gray-600 text-lg block text-center mb-12">
            Gerencie os fornecedores do sistema
          </Text>
        </div>

        <Card className="shadow-lg mb-8">
          <Form
            form={form}
            layout="vertical"
            onFinish={editingKey ? handleUpdate : handleCreate}
          >
            <Form.Item
              name="nome"
              label="Nome"
              rules={[{ required: true, message: 'Por favor, insira o nome' }]}
            >
              <Input placeholder="Digite o nome do fornecedor" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { type: 'email', message: 'Email inválido' },
                { required: true, message: 'Por favor, insira o email' }
              ]}
            >
              <Input placeholder="Digite o email" />
            </Form.Item>

            <Form.Item
              name="telefone"
              label="Telefone"
            >
              <Input placeholder="Digite o telefone" />
            </Form.Item>

            <Form.Item
              name="nif"
              label="NIF"
              rules={[{ required: true, message: 'Por favor, insira o NIF' }]}
            >
              <Input placeholder="Digite o NIF" />
            </Form.Item>

            <Form.Item
              name="morada"
              label="Morada"
            >
              <Input placeholder="Digite a morada" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={editingKey ? <SaveOutlined /> : <SaveOutlined />}
              >
                {editingKey ? 'Atualizar' : 'Criar'} Fornecedor
              </Button>
              {editingKey && (
                <Button className="ml-2" onClick={() => {
                  setEditingKey('');
                  form.resetFields();
                }}>
                  Cancelar
                </Button>
              )}
            </Form.Item>
          </Form>
        </Card>

        <Card className="shadow-lg">
          <Table
            columns={columns}
            dataSource={suppliers}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
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

export default Suppliers;
