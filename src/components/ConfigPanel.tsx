/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Node } from 'reactflow';
import { css } from '@emotion/react';

const Panel = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background: white;
  border-left: 1px solid #e9ecef;
  padding: 20px;
  overflow-y: auto;
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  color: #6c757d;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    color: #495057;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const PanelTitle = styled.h3`
  margin: 0 0 24px 0;
  color: #333;
  font-size: 18px;
`;

const Field = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #495057;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  font-family: monospace;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #0056b3;
  }
`;

const DeleteButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #dc3545;
  color: white;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover {
    background: #c82333;
  }
`;

interface ConfigPanelProps {
  node: any;
  onClose: () => void;
  onUpdate: (nodeId: string, data: any) => void;
}

interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'select' | 'textarea';
  options?: string[];
  placeholder?: string;
}

interface NodeTypeConfig {
  fields: FieldConfig[];
}

interface NodeConfig {
  [key: string]: NodeTypeConfig;
}

const nodeConfigs: NodeConfig = {
  api: {
    fields: [
      { name: 'url', label: 'API URL', type: 'text', placeholder: 'https://api.example.com/v1' },
      { name: 'method', label: 'Method', type: 'select', options: ['GET', 'POST', 'PUT', 'DELETE'] },
      { name: 'headers', label: 'Headers', type: 'textarea', placeholder: '{\n  "Content-Type": "application/json"\n}' },
      { name: 'body', label: 'Request Body', type: 'textarea', placeholder: '{\n  "key": "value"\n}' }
    ]
  },
  database: {
    fields: [
      { name: 'connectionString', label: 'Connection String', type: 'text', placeholder: 'postgresql://user:pass@localhost:5432/db' },
      { name: 'query', label: 'Query', type: 'textarea', placeholder: 'SELECT * FROM users WHERE status = :status' }
    ]
  },
  transform: {
    fields: [
      { name: 'inputFormat', label: 'Input Format', type: 'select', options: ['JSON', 'XML', 'CSV'] },
      { name: 'outputFormat', label: 'Output Format', type: 'select', options: ['JSON', 'XML', 'CSV'] },
      { name: 'transformation', label: 'Transformation', type: 'textarea', placeholder: '// JavaScript transformation code\nreturn input.map(item => ({\n  id: item.id,\n  name: item.name.toUpperCase()\n}));' }
    ]
  },
  filter: {
    fields: [
      { name: 'condition', label: 'Filter Condition', type: 'textarea', placeholder: '// JavaScript filter condition\nreturn item.status === "active" && item.age >= 18;' }
    ]
  },
  function: {
    fields: [
      { name: 'code', label: 'Function Code', type: 'textarea', placeholder: '// JavaScript function code\nfunction process(input) {\n  // Your code here\n  return output;\n}' }
    ]
  },
  output: {
    fields: [
      { name: 'destination', label: 'Destination', type: 'select', options: ['File', 'Email', 'Webhook', 'Message Queue'] },
      { name: 'config', label: 'Output Configuration', type: 'textarea', placeholder: '{\n  "path": "/output/data.json",\n  "format": "json"\n}' }
    ]
  },
  webhook: {
    fields: [
      { name: 'endpoint', label: 'Webhook Endpoint', type: 'text', placeholder: 'https://your-webhook-endpoint.com/hook' },
      { name: 'method', label: 'HTTP Method', type: 'select', options: ['POST', 'PUT'] },
      { name: 'headers', label: 'Headers', type: 'textarea', placeholder: '{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer YOUR_TOKEN"\n}' },
      { name: 'retryConfig', label: 'Retry Configuration', type: 'textarea', placeholder: '{\n  "maxRetries": 3,\n  "retryDelay": 1000,\n  "backoffMultiplier": 2\n}' },
      { name: 'timeout', label: 'Timeout (ms)', type: 'text', placeholder: '5000' }
    ]
  },
  batch: {
    fields: [
      { name: 'schedule', label: 'Schedule', type: 'text', placeholder: '0 0 * * * (cron format)' },
      { name: 'batchSize', label: 'Batch Size', type: 'text', placeholder: '1000' },
      { name: 'concurrency', label: 'Concurrency', type: 'text', placeholder: '5' },
      { name: 'retryConfig', label: 'Retry Configuration', type: 'textarea', placeholder: '{\n  "maxRetries": 3,\n  "retryDelay": 1000\n}' },
      { name: 'errorHandling', label: 'Error Handling', type: 'select', options: ['Skip', 'Retry', 'Fail Batch'] },
      { name: 'timeout', label: 'Timeout (minutes)', type: 'text', placeholder: '60' }
    ]
  },
  messaging: {
    fields: [
      { name: 'provider', label: 'Message Provider', type: 'select', options: ['RabbitMQ', 'Apache Kafka', 'Redis', 'AWS SQS', 'Azure Service Bus'] },
      { name: 'queueName', label: 'Queue/Topic Name', type: 'text', placeholder: 'my-queue-name' },
      { name: 'connectionString', label: 'Connection String', type: 'text', placeholder: 'amqp://localhost:5672' },
      { name: 'messageFormat', label: 'Message Format', type: 'select', options: ['JSON', 'Avro', 'Protobuf', 'Plain Text'] },
      { name: 'deliveryMode', label: 'Delivery Mode', type: 'select', options: ['At Least Once', 'At Most Once', 'Exactly Once'] },
      { name: 'headers', label: 'Message Headers', type: 'textarea', placeholder: '{\n  "content-type": "application/json",\n  "priority": "high"\n}' },
      { name: 'retryConfig', label: 'Retry Configuration', type: 'textarea', placeholder: '{\n  "maxRetries": 3,\n  "retryDelay": 1000\n}' }
    ]
  }
};

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

const ConfigPanel: React.FC<ConfigPanelProps> = ({ node, onClose, onUpdate }) => {
  const [config, setConfig] = useState<any>(node.data.config || {});
  const nodeType = node.data.serviceType?.toLowerCase() || '';
  const nodeConfig = nodeConfigs[nodeType] || { fields: [] };

  useEffect(() => {
    setConfig(node.data.config || {});
  }, [node]);

  const handleChange = (fieldName: string, value: string) => {
    const newConfig = { ...config, [fieldName]: value };
    setConfig(newConfig);
    onUpdate(node.id, { ...node.data, config: newConfig });
  };

  const handleAddEndpoint = () => {
    const endpoints = config.endpoints || [];
    const newEndpoint = {
      id: `endpoint_${Date.now()}`,
      path: '',
      method: 'GET',
      headers: '',
    };
    const newConfig = { ...config, endpoints: [...endpoints, newEndpoint] };
    setConfig(newConfig);
    onUpdate(node.id, { ...node.data, config: newConfig });
  };

  const handleDeleteEndpoint = (id: string) => {
    const endpoints = config.endpoints.filter((ep: any) => ep.id !== id);
    const newConfig = { ...config, endpoints: endpoints };
    setConfig(newConfig);
    onUpdate(node.id, { ...node.data, config: newConfig });
  };

  const handleEndpointChange = (id: string, field: string, value: string) => {
    const endpoints = config.endpoints.map((ep: any) =>
      ep.id === id ? { ...ep, [field]: value } : ep
    );
    const newConfig = { ...config, endpoints: endpoints };
    setConfig(newConfig);
    onUpdate(node.id, { ...node.data, config: newConfig });
  };

  if (!nodeConfig) {
    return (
      <Panel>
        <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
        <PanelTitle>Configure {node.data.label}</PanelTitle>
        <p>No configuration available for this node type.</p>
      </Panel>
    );
  }

  return (
    <Panel>
      <CloseButton onClick={onClose}>
        <CloseIcon />
      </CloseButton>
      <PanelTitle>Configure {node.data.label}</PanelTitle>
      
      <div css={css`
        margin-bottom: 20px;
        display: flex;
        justify-content: flex-end;
      `}>
        <DeleteButton 
          onClick={() => {
            if (window.confirm('Are you sure you want to remove this node?')) {
              onUpdate(node.id, { ...node.data, deleted: true });
              onClose();
            }
          }}
          css={css`
            background: #dc3545;
            &:hover {
              background: #c82333;
            }
          `}
        >
          Remove Node
        </DeleteButton>
      </div>

      {nodeConfig.fields.map((field) => (
        <Field key={field.name}>
          <Label>{field.label}</Label>
          {field.type === 'select' ? (
            <Select
              value={config[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
            >
              <option value="">Select...</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          ) : field.type === 'textarea' ? (
            <Textarea
              value={config[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
            />
          ) : (
            <Input
              type="text"
              value={config[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={field.placeholder}
            />
          )}
        </Field>
      ))}

      {nodeType === 'api' && (
        <>
          <Field>
            <Label>Endpoints</Label>
            <Button onClick={handleAddEndpoint}>Add Endpoint</Button>
          </Field>
          {config.endpoints?.map((endpoint: any) => (
            <div key={endpoint.id} css={css`
              border: 1px solid #ced4da;
              border-radius: 4px;
              padding: 12px;
              margin-bottom: 12px;
            `}>
              <Field>
                <Label>Path</Label>
                <Input
                  type="text"
                  value={endpoint.path}
                  onChange={(e) => handleEndpointChange(endpoint.id, 'path', e.target.value)}
                  placeholder="/api/resource"
                />
              </Field>
              <Field>
                <Label>Method</Label>
                <Select
                  value={endpoint.method}
                  onChange={(e) => handleEndpointChange(endpoint.id, 'method', e.target.value)}
                >
                  {['GET', 'POST', 'PUT', 'DELETE'].map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field>
                <Label>Headers</Label>
                <Textarea
                  value={endpoint.headers}
                  onChange={(e) => handleEndpointChange(endpoint.id, 'headers', e.target.value)}
                  placeholder={'{\n  "Content-Type": "application/json"\n}'}
                />
              </Field>
              <DeleteButton onClick={() => handleDeleteEndpoint(endpoint.id)}>
                Delete Endpoint
              </DeleteButton>
            </div>
          ))}
        </>
      )}
    </Panel>
  );
};

export default ConfigPanel;
