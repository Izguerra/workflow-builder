/** @jsxImportSource @emotion/react */
import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { css } from '@emotion/react';

const ServiceNode: React.FC<NodeProps> = ({ data, selected, isConnectable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nodeName, setNodeName] = useState(data.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      data.updateNodeName(data.id, nodeName);
      setIsEditing(false);
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setNodeName(data.name);
    }
  };

  const handleBlur = () => {
    data.updateNodeName(data.id, nodeName);
    setIsEditing(false);
  };

  return (
    <div
      css={css`
        background: white;
        border: 2px solid ${selected ? '#007bff' : '#ddd'};
        border-radius: 8px;
        padding: 15px;
        min-width: 180px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        position: relative;

        &:hover {
          border-color: #007bff;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
      `}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        style={{
          width: '12px',
          height: '12px',
          background: '#007bff',
          border: '2px solid white',
          top: '-7px',
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{
          width: '12px',
          height: '12px',
          background: '#007bff',
          border: '2px solid white',
          left: '-7px',
        }}
      />
      <div css={css`
        display: flex;
        justify-content: space-between;
        align-items: center;
      `}>
        <div css={css`
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        `}>
          {isEditing ? (
            <input
              ref={inputRef}
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              css={css`
                border: 1px solid #007bff;
                border-radius: 4px;
                padding: 4px 8px;
                font-size: 14px;
                width: 100%;
                outline: none;
              `}
            />
          ) : (
            <div
              onDoubleClick={handleDoubleClick}
              css={css`
                font-weight: 500;
                cursor: text;
              `}
            >
              {data.name}
            </div>
          )}
          <div css={css`
            font-size: 12px;
            color: #666;
            background: #f0f0f0;
            padding: 2px 6px;
            border-radius: 4px;
          `}>
            {data.serviceType}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            data.onDeleteNode(data.id);
          }}
          css={css`
            background: none;
            border: none;
            color: #dc3545;
            cursor: pointer;
            padding: 4px;
            margin-left: 8px;
            border-radius: 4px;
            font-size: 16px;
            line-height: 1;
            
            &:hover {
              background: #ffebee;
            }
          `}
        >
          ×
        </button>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{
          width: '12px',
          height: '12px',
          background: '#007bff',
          border: '2px solid white',
          right: '-7px',
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        style={{
          width: '12px',
          height: '12px',
          background: '#007bff',
          border: '2px solid white',
          bottom: '-7px',
        }}
      />
    </div>
  );
};

export default ServiceNode;
