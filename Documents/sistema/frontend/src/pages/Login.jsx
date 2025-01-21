import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Layout, Typography, Button, Card, Form, Input, Alert, Tooltip, Spin } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined, SafetyCertificateOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import '../index.css';

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const currentYear = new Date().getFullYear();

  const handleSubmit = async (values) => {
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/v1/auth/login', {
        email: values.email,
        senha: values.password
      });
      
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userRole', response.data.user.papel);
      localStorage.setItem('userName', response.data.user.nome);
      navigate('/dashboard');
    } catch (err) {
      setError('Credenciais inválidas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="min-h-screen login-page">
      <Content className="flex items-center justify-center p-4 sm:p-8 relative">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-indigo-500/10 animate-gradient-x" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[380px] z-10"
        >
          {/* Logo and Welcome Section */}
          <div className="text-center mb-6">
            <motion.div 
              className="flex justify-center mb-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <SafetyCertificateOutlined className="text-4xl text-white" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <Title level={3} className="text-gradient m-0">
                Drive360 Management
              </Title>
              <Text className="text-gray-600 text-base">
                Acesse o sistema
              </Text>
            </motion.div>
          </div>

          {/* Login Card */}
          <Card 
            className="login-card backdrop-blur-md px-4 py-6"
            bordered={false}
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Alert
                  message="Erro de autenticação"
                  description={error}
                  type="error"
                  showIcon
                  className="mb-6"
                />
              </motion.div>
            )}

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="login-form space-y-3"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Por favor, insira seu email' },
                  { type: 'email', message: 'Email inválido' }
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  suffix={
                    <Tooltip title="Digite seu email corporativo">
                      <InfoCircleOutlined className="text-gray-400" />
                    </Tooltip>
                  }
                  placeholder="Seu email"
                  size="large"
                  className="login-input"
                  autoComplete="email"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Por favor, insira sua senha' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="Sua senha"
                  size="large"
                  className="login-input"
                  autoComplete="current-password"
                />
              </Form.Item>

              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={loading ? <Spin /> : <LoginOutlined />}
                  size="large"
                  loading={loading}
                  className="login-button"
                  block
                >
                  {loading ? 'Entrando...' : 'Entrar no Sistema'}
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <Text className="text-center block mt-4 text-sm text-gray-500">
            Problemas com o acesso? Entre em contato com o suporte
          </Text>
        </motion.div>
      </Content>

      <Footer className="text-center bg-transparent">
        <Text className="text-sm text-gray-500">
          © {currentYear} Drive360 by Naps Parts & Solutions
        </Text>
      </Footer>
    </Layout>
  );
};

export default Login;