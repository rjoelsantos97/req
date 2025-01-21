import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Row, Col, Typography, Space, Layout, Divider, Avatar } from 'antd';
import { 
  HomeOutlined, 
  FileTextOutlined, 
  PlusOutlined,
  LogoutOutlined,
  DashboardOutlined,
  TeamOutlined,
  UserOutlined // Ícone para fornecedores
} from '@ant-design/icons';
import RoleBasedElement from '../components/RoleBasedElement';

const { Title, Paragraph, Text } = Typography;
const { Header, Content, Footer } = Layout;

const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const currentYear = new Date().getFullYear();

  return (
    <Layout className="min-h-screen overflow-x-hidden">
      <Header className="fixed w-full z-50 flex justify-between items-center bg-blue-600" style={{ padding: '0 8px' }}>
        <div className="flex items-center">
          <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />}  />
          <Text className="text-white text-lg ml-2" style={{ color: '#f0f0f0' }}>  Olá, {userName}           </Text>
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            size="large"
            onClick={handleLogout}
            className="logout-button-fixed ml-6"
            
          >
            Sair
          </Button>
        </div>
      </Header>

      <Content style={{ padding: '88px 4px 24px' }} className="w-full overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="dashboard-header animate-fade-in">
            <Space direction="vertical" size={0} className="w-full">
              

              <Divider className="my-8">
                <Title level={1} className="header-title m-0">
                  Painel de Controle
                </Title>
              </Divider>

              <Divider orientation="left" className="border-transparent">
                <Text className="header-subtitle">
                  Bem-vindo ao sistema de gestão integrado
                </Text>
              </Divider>
              
              <Divider orientation="right" className="border-transparent">
                <Text className="header-description">
                  Selecione uma das opções abaixo para começar
                </Text>
              </Divider>
            </Space>
          </div>

          <Row gutter={[4, 16]} className="w-full m-0">
            <RoleBasedElement allowedRoles={['admin']}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  className="dashboard-card dashboard-card-blue"
                  onClick={() => handleNavigation('/warehouses')}
                  bodyStyle={{ padding: '1.5rem' }}
                >
                  <div className="dashboard-icon-container bg-blue-50">
                    <HomeOutlined className="dashboard-icon-blue" />
                  </div>
                  <Title level={3} className="text-2xl font-bold text-gray-800 mb-4">
                    Gerir Armazéns
                  </Title>
                  <Paragraph className="text-lg text-gray-600 leading-relaxed">
                    Administre os armazéns do sistema de forma eficiente e organizada
                  </Paragraph>
                </Card>
              </Col>
            </RoleBasedElement>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                className="dashboard-card dashboard-card-indigo"
                onClick={() => handleNavigation('/requests')}
                bodyStyle={{ padding: '1.5rem' }}
              >
                <div className="dashboard-icon-container bg-indigo-50">
                  <FileTextOutlined className="dashboard-icon-indigo" />
                </div>
                  <Title level={3} className="text-2xl font-bold text-gray-800 mb-4">
                    Gerir Requisições
                  </Title>
                  <Paragraph className="text-lg text-gray-600 leading-relaxed">
                    Visualize e gerencie todas as requisições do sistema em tempo real
                  </Paragraph>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  className="dashboard-card dashboard-card-green"
                  onClick={() => handleNavigation('/requests/new')}
                  bodyStyle={{ padding: '1.5rem' }}
                >
                  <div className="dashboard-icon-container bg-green-50">
                    <PlusOutlined className="dashboard-icon-green" />
                  </div>
                  <Title level={3} className="text-2xl font-bold text-gray-800 mb-4">
                    Nova Requisição
                  </Title>
                  <Paragraph className="text-lg text-gray-600 leading-relaxed">
                    Crie e submeta novas requisições de forma rápida e simplificada
                  </Paragraph>
                </Card>
              </Col>
              <RoleBasedElement allowedRoles={['admin']}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    className="dashboard-card dashboard-card-teal"
                    onClick={() => handleNavigation('/suppliers')}
                    bodyStyle={{ padding: '1.5rem' }}
                  >
                    <div className="dashboard-icon-container bg-teal-50">
                      <TeamOutlined className="dashboard-icon-teal" />
                    </div>
                    <Title level={3} className="text-2xl font-bold text-gray-800 mb-4">
                      Gerir Fornecedores
                    </Title>
                    <Paragraph className="text-lg text-gray-600 leading-relaxed">
                      Administre os fornecedores do sistema de forma eficiente e organizada
                    </Paragraph>
                  </Card>
                </Col>
              </RoleBasedElement>
            </Row>
          </div>
        </Content>

        <Footer className="bg-transparent" style={{ padding: '24px 8px' }}>
          <Text className="text-gray-500 text-center block">
            © {currentYear} Drive360 by Naps Parts & Solutions | Todos os direitos reservados.
          </Text>
        </Footer>
      </Layout>
    );
  };

  export default Dashboard;