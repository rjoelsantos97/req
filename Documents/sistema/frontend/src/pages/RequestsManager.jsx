import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Requests from './Requests';
import RequestForm from './RequestForm';
import { Layout, Typography, Button, Card, message } from 'antd';
import { LogoutOutlined,DashboardOutlined } from '@ant-design/icons';
import RoleBasedElement from '../components/RoleBasedElement';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const RequestsManager = () => {
  const navigate = useNavigate();
  const [editingRequest, setEditingRequest] = useState(null);
  const [refreshRequests, setRefreshRequests] = useState(false);
  const userRole = localStorage.getItem('userRole');

  const handleEditRequest = (request) => {
    setEditingRequest(request);
  };

  const handleDeleteRequest = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`/api/v1/requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Requisição excluída com sucesso!');
      setRefreshRequests(prev => !prev);
    } catch (err) {
      message.error('Erro ao excluir requisição');
    }
  };

  const handleSaveRequest = () => {
    setEditingRequest(null);
    setRefreshRequests(prev => !prev);
  };

  return (
    <Layout className="min-h-screen">
      <Header className="fixed w-full z-50 flex justify-end items-center px-8 py-4">
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
          onClick={() => navigate('/requests/new')}
        >
          Nova Requisição
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
        <Card className="shadow-lg">
          {editingRequest && userRole === 'admin' ? (
            <RequestForm
              requestToEdit={editingRequest}
              onSave={handleSaveRequest}
              onCancel={() => setEditingRequest(null)}
              userRole={userRole}
            />
          ) : (
            <Requests
              onEditRequest={handleEditRequest}
              onDeleteRequest={handleDeleteRequest}
              refresh={refreshRequests}
              userRole={userRole} // Passa o papel do usuário para o componente Requests
            />
          )}
        </Card>
      </Content>

      <Footer className="text-center">
        <Text className="text-gray-500">
          © 2025 Sistema de Gestão. Todos os direitos reservados.
        </Text>
      </Footer>
    </Layout>
  );
};

export default RequestsManager;