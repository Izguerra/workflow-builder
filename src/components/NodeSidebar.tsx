/** @jsxImportSource @emotion/react */
import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

const Sidebar = styled.div`
  width: 80px;
  background: white;
  border-right: 1px solid #e9ecef;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SidebarTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #6c757d;
  margin-bottom: 16px;
  text-align: center;
`;

const NodeButton = styled.button`
  width: 48px;
  height: 48px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: white;
  margin-bottom: 12px;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  position: relative;
  padding: 0;

  &:hover {
    border-color: #007bff;
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    svg {
      color: #007bff;
    }

    .tooltip {
      opacity: 1;
      visibility: visible;
    }
  }

  svg {
    width: 24px;
    height: 24px;
    color: #6c757d;
    transition: color 0.2s;
  }
`;

const Tooltip = styled.div`
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 8px;
  padding: 4px 8px;
  background: #212529;
  color: white;
  font-size: 12px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border: 4px solid transparent;
    border-right-color: #212529;
  }
`;

// Node Icons (same as ServiceNode)
const APIIcon = () => (
  <svg viewBox="0 0 511 511" fill="currentColor">
    <path d="M492.168,309.579l-17.626-10.177c2.96-14.723,4.458-29.466,4.458-43.902c0-14.646-1.474-29.403-4.384-43.946l17.552-10.134 c5.436-3.138,9.325-8.206,10.949-14.269s0.791-12.396-2.348-17.832l-48-83.139c-3.139-5.436-8.206-9.325-14.269-10.949 c-6.064-1.624-12.396-0.791-17.833,2.348l-17.566,10.142C380.912,68.2,354.798,53.092,327,43.692V23.5 C327,10.542,316.458,0,303.5,0h-96C194.542,0,184,10.542,184,23.5v20.193c-27.65,9.362-53.728,24.49-75.999,44.088L90.332,77.579 c-5.437-3.139-11.77-3.973-17.833-2.348c-6.063,1.625-11.13,5.513-14.269,10.949l-48,83.139 c-3.139,5.436-3.972,11.769-2.348,17.832s5.513,11.131,10.949,14.269l17.626,10.177C33.499,226.32,32,241.063,32,255.5 c0,14.644,1.474,29.401,4.384,43.945l-17.552,10.134c-11.222,6.479-15.08,20.879-8.602,32.102l48,83.139 c6.479,11.221,20.879,15.08,32.102,8.601l17.565-10.142c22.19,19.521,48.303,34.629,76.103,44.03V487.5 c0,12.958,10.542,23.5,23.5,23.5h96c12.958,0,23.5-10.542,23.5-23.5v-20.193c27.651-9.362,53.729-24.49,76-44.087l17.668,10.201 c11.221,6.479,25.623,2.62,32.102-8.601l48-83.139C507.248,330.458,503.39,316.058,492.168,309.579z"/>
    <path d="M255.5,104C171.962,104,104,171.963,104,255.5S171.962,407,255.5,407S407,339.037,407,255.5S339.038,104,255.5,104z M255.5,392C180.234,392,119,330.766,119,255.5S180.234,119,255.5,119S392,180.234,392,255.5S330.766,392,255.5,392z"/>
  </svg>
);

const DatabaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3c4.97 0 9 2.24 9 5s-4.03 5-9 5-9-2.24-9-5 4.03-5 9-5z" />
    <path d="M21 12c0 2.76-4.03 5-9 5s-9-2.24-9-5" />
    <path d="M21 17c0 2.76-4.03 5-9 5s-9-2.24-9-5" />
  </svg>
);

const TransformIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 17H7c-2.76 0-5-2.24-5-5s2.24-5 5-5h10c2.76 0 5 2.24 5 5s-2.24 5-5 5zM7 7v10M17 7v10" />
  </svg>
);

const FilterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
  </svg>
);

const FunctionIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);

const OutputIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

const WebhookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2v6M12 22v-6M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M22 12h-6M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24" />
  </svg>
);

const BatchJobIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
    <line x1="9" y1="9" x2="9" y2="21" />
    <line x1="15" y1="9" x2="15" y2="21" />
  </svg>
);

const MessagingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const nodeTypes = [
  { type: 'api', label: 'API', icon: APIIcon },
  { type: 'database', label: 'Database', icon: DatabaseIcon },
  { type: 'transform', label: 'Transform', icon: TransformIcon },
  { type: 'filter', label: 'Filter', icon: FilterIcon },
  { type: 'function', label: 'Function', icon: FunctionIcon },
  { type: 'output', label: 'Output', icon: OutputIcon },
  { type: 'webhook', label: 'Webhook', icon: WebhookIcon },
  { type: 'batch', label: 'Batch Job', icon: BatchJobIcon },
  { type: 'messaging', label: 'Messaging', icon: MessagingIcon },
];

interface NodeSidebarProps {
  onAddNode: (type: string) => void;
}

const NodeSidebar: React.FC<NodeSidebarProps> = ({ onAddNode }) => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', 'service');
    event.dataTransfer.setData('service-type', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Sidebar>
      <SidebarTitle>Add Node</SidebarTitle>
      {nodeTypes.map(({ type, label, icon: Icon }) => (
        <NodeButton
          key={type}
          draggable
          onDragStart={(e) => onDragStart(e, type)}
          onClick={() => onAddNode(type)}
          title={label}
        >
          <Icon />
          <Tooltip className="tooltip">{label}</Tooltip>
        </NodeButton>
      ))}
    </Sidebar>
  );
};

export default NodeSidebar;
