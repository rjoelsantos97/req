import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';
import moment from 'moment';

const RequestDetails = ({ request, visible, onClose }) => {
  if (!request) return null;

  return (
    <Modal
      title={`Detalhes da Requisição ${request.numero}`}
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Descriptions bordered column={2}>
        <Descriptions.Item label="Número">{request.numero}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <Tag color={
            request.status === 'Aprovado' ? 'green' :
            request.status === 'Pendente' ? 'gold' :
            request.status === 'Concluído' ? 'blue' : 'red'
          }>
            {request.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Categoria">{request.categoria}</Descriptions.Item>
        <Descriptions.Item label="Departamento">{request.departamento}</Descriptions.Item>
        <Descriptions.Item label="Armazém">{request.Warehouse?.nome}</Descriptions.Item>
        <Descriptions.Item label="Fornecedor">{request.Supplier?.nome || '-'}</Descriptions.Item>

        {request.categoria === 'Reparação/Manutenção' && (
          <>
            <Descriptions.Item label="Marca">{request.marca || '-'}</Descriptions.Item>
            <Descriptions.Item label="Modelo">{request.modelo || '-'}</Descriptions.Item>
            <Descriptions.Item label="Matrícula">{request.matricula || '-'}</Descriptions.Item>
            <Descriptions.Item label="Quilômetros">{request.quilometros || '-'}</Descriptions.Item>
            <Descriptions.Item label="Descrição da Intervenção" span={2}>
              {request.descricaoIntervencao || '-'}
            </Descriptions.Item>
          </>
        )}

        {request.categoria === 'Aquisição de Material' && (
          <>
            <Descriptions.Item label="Descrição do Material" span={2}>
              {request.descricaoMaterial || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Finalidade" span={2}>
              {request.finalidade || '-'}
            </Descriptions.Item>
          </>
        )}

        <Descriptions.Item label="Criado por">
          {request.creator?.nome}
        </Descriptions.Item>
        <Descriptions.Item label="Data de criação">
          {moment(request.createdAt).format('DD/MM/YYYY HH:mm:ss')}
        </Descriptions.Item>

        {request.editor && (
          <>
            <Descriptions.Item label="Última edição por">
              {request.editor?.nome}
            </Descriptions.Item>
            <Descriptions.Item label="Data da última edição">
              {moment(request.updatedAt).format('DD/MM/YYYY HH:mm:ss')}
            </Descriptions.Item>
          </>
        )}
      </Descriptions>
    </Modal>
  );
};

export default RequestDetails;
