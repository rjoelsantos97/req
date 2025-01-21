import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import { Layout, Typography, Button, Form, Input, Select, Card, Space, message } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const RequestForm = ({ requestToEdit, onSave, userRole }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    warehouseId: '',
    categoria: '',
    departamento: '',
    descricaoIntervencao: '',
    descricaoMaterial: '',
    finalidade: '',
    marca: '',
    modelo: '',
    matricula: '',
    quilometros: '',
    status: 'Pendente',
    supplierId: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [warehouses, setWarehouses] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Carrega dados ao montar o componente
  useEffect(() => {
    fetchWarehouses();
    fetchSuppliers();

    if (id) {
      fetchRequestDetails(id);
    } else if (requestToEdit) {
      form.setFieldsValue(requestToEdit);
      setFormData(requestToEdit);
    }
  }, [id, requestToEdit, form]);

  // Busca a lista de armazéns
  const fetchWarehouses = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('/api/v1/warehouses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWarehouses(response.data);
    } catch (err) {
      setError('Erro ao carregar armazéns.');
    }
  };

  // Busca a lista de fornecedores
  const fetchSuppliers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get('/api/v1/suppliers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuppliers(response.data);
    } catch (err) {
      setError('Erro ao carregar fornecedores.');
    }
  };

  // Busca os detalhes da requisição para edição
  const fetchRequestDetails = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`/api/v1/requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      form.setFieldsValue(response.data);
      setFormData(response.data);
    } catch (err) {
      setError('Erro ao carregar detalhes da requisição.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (value) => {
    setFormData(prev => ({ ...prev, categoria: value }));
  };

  const handleSubmit = async (values) => {
    try {
      const token = localStorage.getItem('authToken');
      let response;

      // Log the values being sent
      console.log('Sending form data:', values);

      if (id || requestToEdit) {
        response = await axios.put(`/api/v1/requests/${id || requestToEdit.id}`, values, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
      } else {
        response = await axios.post('/api/v1/requests', values, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
      }

      console.log('Response:', response.data);
      message.success(`Requisição ${id || requestToEdit ? 'atualizada' : 'criada'} com sucesso!`);
      
      if (onSave) {
        onSave();
      } else {
        navigate('/requests');
      }
    } catch (err) {
      console.error('Erro ao salvar requisição:', err.response?.data || err);
      message.error(err.response?.data?.error || 'Erro ao salvar a requisição. Verifique os dados e tente novamente.');
    }
  };

  const handleCancel = () => {
    navigate('/requests');
  };

  return (
    <Layout className="min-h-screen">
      <Header className="fixed w-full z-50 flex justify-end items-center px-8 py-4">
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          size="large"
          onClick={() => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userRole');
            navigate('/');
          }}
          className="logout-button-fixed"
        >
          Sair do Sistema
        </Button>
      </Header>

      <Content className="pt-24 px-8 pb-12">
        <div className="dashboard-header animate-fade-in">
          <Title level={1} className="header-title text-center mb-6">
            {id || requestToEdit ? 'Editar Requisição' : 'Nova Requisição'}
          </Title>
          <Text className="text-gray-600 text-lg block text-center mb-12">
            {id || requestToEdit ? 'Atualize os detalhes da requisição abaixo.' : 'Preencha os detalhes da nova requisição abaixo.'}
          </Text>
        </div>

        <Card className="shadow-lg">
          <Form
            form={form}
            layout="vertical"
            initialValues={formData}
            onFinish={handleSubmit}
          >
            <Form.Item
              label="Armazém"
              name="warehouseId"
              rules={[{ required: true, message: 'Por favor, selecione um armazém.' }]}
            >
              <Select placeholder="Selecione um armazém">
                {warehouses.map(warehouse => (
                  <Option key={warehouse.id} value={warehouse.id}>
                    {warehouse.nome}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Categoria"
              name="categoria"
              rules={[{ required: true, message: 'Por favor, selecione uma categoria.' }]}
            >
              <Select placeholder="Selecione uma categoria" onChange={handleCategoryChange}>
                <Option value="Reparação/Manutenção">Reparação/Manutenção</Option>
                <Option value="Aquisição de Material">Aquisição de Material</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Departamento"
              name="departamento"
              rules={[{ required: true, message: 'Por favor, insira o departamento.' }]}
            >
              <Input placeholder="Digite o departamento" />
            </Form.Item>

            {formData.categoria === 'Reparação/Manutenção' && (
              <>
                <Form.Item label="Marca" name="marca">
                  <Input placeholder="Digite a marca" />
                </Form.Item>
                <Form.Item label="Modelo" name="modelo">
                  <Input placeholder="Digite o modelo" />
                </Form.Item>
                <Form.Item label="Matrícula" name="matricula">
                  <Input placeholder="Digite a matrícula" />
                </Form.Item>
                <Form.Item label="Quilômetros" name="quilometros">
                  <Input placeholder="Digite os quilômetros" />
                </Form.Item>
                <Form.Item label="Descrição da Intervenção" name="descricaoIntervencao">
                  <TextArea rows={4} placeholder="Descreva a intervenção" />
                </Form.Item>
              </>
            )}

            {formData.categoria === 'Aquisição de Material' && (
              <>
                <Form.Item label="Descrição do Material" name="descricaoMaterial">
                  <TextArea rows={4} placeholder="Descreva o material" />
                </Form.Item>
                <Form.Item label="Finalidade" name="finalidade">
                  <TextArea rows={4} placeholder="Descreva a finalidade" />
                </Form.Item>
              </>
            )}

            <Form.Item label="Fornecedor" name="supplierId">
              <Select placeholder="Selecione um fornecedor">
                {suppliers.map(supplier => (
                  <Option key={supplier.id} value={supplier.id}>
                    {supplier.nome}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Status" name="status">
              <Select placeholder="Selecione o status">
                <Option value="Pendente">Pendente</Option>
                <Option value="Aprovado">Aprovado</Option>
                <Option value="Concluído">Concluído</Option>
                <Option value="Cancelado">Cancelado</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {id || requestToEdit ? 'Atualizar' : 'Criar'}
                </Button>
                <Button onClick={handleCancel}>Cancelar</Button>
              </Space>
            </Form.Item>
          </Form>
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

export default RequestForm;