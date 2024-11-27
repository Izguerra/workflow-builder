/** @jsxImportSource @emotion/react */
import React, { useState, useCallback, ComponentType } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Connection,
  Edge,
  Node,
  MiniMap,
  Panel,
  MarkerType,
  EdgeLabelRenderer,
  BaseEdge,
  EdgeProps,
  getStraightPath,
  EdgeTypes,
  EdgeMarker,
  DefaultEdgeOptions,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import './WorkflowBuilder.css';

import ServiceNode from './ServiceNode';
import NodeSidebar from './NodeSidebar';
import ConfigPanel from './ConfigPanel';

// Styled components for edge controls
const EdgeButton = styled.button`
  width: 24px;
  height: 24px;
  background: #ffffff;
  border: 1px solid #007bff;
  border-radius: 50%;
  color: #007bff;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 4px;
  padding: 0;
  
  &:hover {
    background: #007bff;
    color: white;
  }
`;

const EditIconSpan = styled.span`
  cursor: pointer;
  color: #007bff;
  margin-left: 4px;
  
  &:hover {
    color: #0056b3;
  }
`;

const EdgeLabelInput = styled.input`
  width: 150px;
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 12px;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const EdgeControls = styled.div`
  display: flex;
  align-items: center;
  padding: 4px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const LabelContainer = styled.div<{ isVisible: boolean }>`
  display: flex;
  align-items: center;
  background: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-family: sans-serif;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  cursor: pointer;
  opacity: ${props => props.isVisible ? 1 : 0};
  transition: opacity 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  pointer-events: ${props => props.isVisible ? 'all' : 'none'};

  &:hover {
    box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  }
`;

const EdgeWrapper = styled.div`
  position: absolute;
  transform: translate(-50%, -50%);
  pointer-events: all;
`;

const EdgeStyleButton = styled.button`
  width: 24px;
  height: 24px;
  background: #ffffff;
  border: 1px solid #007bff;
  border-radius: 4px;
  color: #007bff;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 4px;
  padding: 0;
  
  &:hover {
    background: #007bff;
    color: white;
  }
`;

const ColorPicker = styled.input`
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  
  &::-webkit-color-swatch {
    border: 1px solid #007bff;
    border-radius: 4px;
  }
`;

const StyleControls = styled.div`
  display: flex;
  align-items: center;
  padding: 4px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 8px;
`;

const SaveButton = styled.button`
  padding: 8px 16px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;

  &:hover {
    background: #218838;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const SaveIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z"/>
  </svg>
);

const LoadButton = styled(SaveButton)`
  background: #17a2b8;
  margin-right: 8px;

  &:hover {
    background: #138496;
  }
`;

const LoadIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
  </svg>
);

const AddWorkflowButton = styled.button`
  padding: 4px 8px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: #0056b3;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14"/>
  </svg>
);

const WorkflowList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const WorkflowItem = styled.div`
  padding: 12px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f8f9fa;
  }
`;

const WorkflowName = styled.div`
  font-weight: 500;
`;

const WorkflowDate = styled.div`
  font-size: 12px;
  color: #6c757d;
`;

const NoWorkflows = styled.div`
  padding: 16px;
  text-align: center;
  color: #6c757d;
`;

const SaveDialog = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1000;
  width: 400px;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 999;
`;

const DialogTitle = styled.h3`
  margin: 0 0 16px 0;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  background: ${props => props.variant === 'primary' ? '#007bff' : '#6c757d'};
  color: white;

  &:hover {
    background: ${props => props.variant === 'primary' ? '#0056b3' : '#5a6268'};
  }
`;

interface CustomEdgeData {
  label?: string;
  isEditing?: boolean;
  direction?: 'left' | 'right' | 'both';
  lineStyle?: 'solid' | 'dotted' | 'double';
  arrowType?: 'solid' | 'outline';
  color?: string;
}

interface SavedWorkflow {
  nodes: Node[];
  edges: Edge[];
  name: string;
  timestamp: number;
}

interface WorkflowData {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  timestamp: number;
}

const createMarker = (color: string, arrowType: 'solid' | 'outline' | undefined): EdgeMarker => ({
  type: arrowType === 'outline' ? MarkerType.Arrow : MarkerType.ArrowClosed,
  color: color,
  width: 20,
  height: 20,
});

// Custom Edge component with buttons and label
const CustomEdge: ComponentType<EdgeProps<CustomEdgeData>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
  markerStart,
  style,
  selected,
  data,
}) => {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [labelText, setLabelText] = useState(data?.label || '');
  const [isHovered, setIsHovered] = useState(false);

  const onDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const updateEdgeLabel = () => {
    if (!isEditing) return;
    const event = new CustomEvent('updateEdgeLabel', {
      detail: { id, label: labelText }
    });
    window.dispatchEvent(event);
    setIsEditing(false);
  };

  const setDirection = (direction: 'left' | 'right' | 'both') => {
    const event = new CustomEvent('setEdgeDirection', { 
      detail: { id, direction } 
    });
    window.dispatchEvent(event);
  };

  const setLineStyle = (lineStyle: 'solid' | 'dotted' | 'double') => {
    const event = new CustomEvent('setEdgeStyle', { 
      detail: { id, lineStyle } 
    });
    window.dispatchEvent(event);
  };

  const setArrowType = (arrowType: 'solid' | 'outline') => {
    const event = new CustomEvent('setArrowType', { 
      detail: { id, arrowType } 
    });
    window.dispatchEvent(event);
  };

  const setColor = (color: string) => {
    const event = new CustomEvent('setEdgeColor', { 
      detail: { id, color } 
    });
    window.dispatchEvent(event);
  };

  const getLineStyle = () => {
    switch (data?.lineStyle) {
      case 'dotted':
        return '3 3';
      case 'double':
        return undefined; // We'll handle double lines differently
      default:
        return undefined;
    }
  };

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        markerStart={markerStart} 
        style={{
          ...style,
          stroke: data?.color || '#007bff',
          strokeDasharray: getLineStyle(),
        }} 
      />
      {data?.lineStyle === 'double' && (
        <BaseEdge 
          path={edgePath} 
          style={{
            ...style,
            stroke: data?.color || '#007bff',
            transform: 'translate(0, 2px)',
          }} 
        />
      )}
      <EdgeLabelRenderer>
        <EdgeWrapper
          style={{
            transform: `translate(${labelX}px,${labelY}px)`,
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="edge-wrapper"
        >
          {selected && !isEditing && (
            <>
              <StyleControls>
                <EdgeStyleButton
                  onClick={() => setLineStyle('solid')}
                  style={{ 
                    background: data?.lineStyle === 'solid' ? '#007bff' : '#ffffff',
                    color: data?.lineStyle === 'solid' ? '#ffffff' : '#007bff',
                  }}
                  title="Solid line"
                >
                  ─
                </EdgeStyleButton>
                <EdgeStyleButton
                  onClick={() => setLineStyle('dotted')}
                  style={{ 
                    background: data?.lineStyle === 'dotted' ? '#007bff' : '#ffffff',
                    color: data?.lineStyle === 'dotted' ? '#ffffff' : '#007bff',
                  }}
                  title="Dotted line"
                >
                  ⋯
                </EdgeStyleButton>
                <EdgeStyleButton
                  onClick={() => setLineStyle('double')}
                  style={{ 
                    background: data?.lineStyle === 'double' ? '#007bff' : '#ffffff',
                    color: data?.lineStyle === 'double' ? '#ffffff' : '#007bff',
                  }}
                  title="Double line"
                >
                  ═
                </EdgeStyleButton>
                <EdgeStyleButton
                  onClick={() => setArrowType('solid')}
                  style={{ 
                    background: data?.arrowType === 'solid' ? '#007bff' : '#ffffff',
                    color: data?.arrowType === 'solid' ? '#ffffff' : '#007bff',
                  }}
                  title="Solid arrow"
                >
                  ▶
                </EdgeStyleButton>
                <EdgeStyleButton
                  onClick={() => setArrowType('outline')}
                  style={{ 
                    background: data?.arrowType === 'outline' ? '#007bff' : '#ffffff',
                    color: data?.arrowType === 'outline' ? '#ffffff' : '#007bff',
                  }}
                  title="Outline arrow"
                >
                  ▷
                </EdgeStyleButton>
                <ColorPicker
                  type="color"
                  value={data?.color || '#007bff'}
                  onChange={(e) => setColor(e.target.value)}
                  title="Connection color"
                />
              </StyleControls>
              <EdgeControls>
                <EdgeButton
                  onClick={() => setDirection('left')}
                  style={{ 
                    background: data?.direction === 'left' ? '#007bff' : '#ffffff',
                    color: data?.direction === 'left' ? '#ffffff' : '#007bff',
                  }}
                  title="Left direction"
                >
                  ←
                </EdgeButton>
                <EdgeButton
                  onClick={() => setDirection('both')}
                  style={{ 
                    background: data?.direction === 'both' ? '#007bff' : '#ffffff',
                    color: data?.direction === 'both' ? '#ffffff' : '#007bff',
                  }}
                  title="Bidirectional"
                >
                  ↔
                </EdgeButton>
                <EdgeButton
                  onClick={() => setDirection('right')}
                  style={{ 
                    background: data?.direction === 'right' ? '#007bff' : '#ffffff',
                    color: data?.direction === 'right' ? '#ffffff' : '#007bff',
                  }}
                  title="Right direction"
                >
                  →
                </EdgeButton>
                <EdgeButton
                  onClick={() => {
                    const event = new CustomEvent('deleteEdge', { detail: { id } });
                    window.dispatchEvent(event);
                  }}
                  style={{ color: '#dc3545', borderColor: '#dc3545' }}
                  title="Delete connection"
                >
                  ×
                </EdgeButton>
              </EdgeControls>
            </>
          )}
          <LabelContainer
            onDoubleClick={onDoubleClick}
            style={{
              marginTop: selected ? '8px' : '0',
            }}
            isVisible={selected || isHovered}
            className="label-container"
          >
            {isEditing ? (
              <EdgeLabelInput
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                onBlur={updateEdgeLabel}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    updateEdgeLabel();
                  }
                }}
                autoFocus
              />
            ) : (
              <>
                <span>{labelText || 'Label'}</span>
                <EditIconSpan title="Edit label">✎</EditIconSpan>
              </>
            )}
          </LabelContainer>
        </EdgeWrapper>
      </EdgeLabelRenderer>
    </>
  );
};

const nodeTypes = {
  service: ServiceNode,
};

const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

// Default edge options
const defaultEdgeOptions: DefaultEdgeOptions = {
  type: 'smoothstep',
  style: {
    strokeWidth: 2,
    stroke: '#007bff',
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: '#007bff',
    width: 20,
    height: 20,
  },
  animated: true,
};

const getMarkerType = (arrowType: 'solid' | 'outline' | undefined) => {
  return arrowType === 'outline' ? MarkerType.Arrow : MarkerType.ArrowClosed;
};

const WorkflowBuilder: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [workflowName, setWorkflowName] = useState<string>('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [savedWorkflows, setSavedWorkflows] = useState<SavedWorkflow[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowData[]>([]);
  const [activeWorkflowId, setActiveWorkflowId] = useState<string | null>(null);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [workflowToRename, setWorkflowToRename] = useState<WorkflowData | null>(null);

  // Initialize with a default workflow
  React.useEffect(() => {
    if (workflows.length === 0) {
      const newWorkflow: WorkflowData = {
        id: crypto.randomUUID(),
        name: 'New Workflow',
        nodes: [],
        edges: [],
        timestamp: Date.now(),
      };
      setWorkflows([newWorkflow]);
      setActiveWorkflowId(newWorkflow.id);
    }
  }, []);

  // Load active workflow data
  React.useEffect(() => {
    if (activeWorkflowId) {
      const workflow = workflows.find(w => w.id === activeWorkflowId);
      if (workflow) {
        setNodes(workflow.nodes);
        setEdges(workflow.edges);
      }
    }
  }, [activeWorkflowId]);

  // Save workflow changes
  React.useEffect(() => {
    if (activeWorkflowId) {
      setWorkflows(currentWorkflows => 
        currentWorkflows.map(workflow => 
          workflow.id === activeWorkflowId
            ? { ...workflow, nodes, edges, timestamp: Date.now() }
            : workflow
        )
      );
    }
  }, [nodes, edges]);

  const addNewWorkflow = () => {
    const newWorkflow: WorkflowData = {
      id: crypto.randomUUID(),
      name: 'New Workflow',
      nodes: [],
      edges: [],
      timestamp: Date.now(),
    };
    setWorkflows(prev => [...prev, newWorkflow]);
    setActiveWorkflowId(newWorkflow.id);
  };

  const deleteWorkflow = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (workflows.length === 1) {
      alert('Cannot delete the last workflow');
      return;
    }
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      setWorkflows(prev => prev.filter(w => w.id !== id));
      if (activeWorkflowId === id) {
        setActiveWorkflowId(workflows.find(w => w.id !== id)?.id || null);
      }
    }
  };

  const startRenameWorkflow = (workflow: WorkflowData, event: React.MouseEvent) => {
    event.stopPropagation();
    setWorkflowToRename(workflow);
    setWorkflowName(workflow.name);
    setShowRenameDialog(true);
  };

  const renameWorkflow = () => {
    if (!workflowToRename || !workflowName.trim()) return;
    
    setWorkflows(prev => 
      prev.map(w => 
        w.id === workflowToRename.id
          ? { ...w, name: workflowName.trim() }
          : w
      )
    );
    
    setShowRenameDialog(false);
    setWorkflowToRename(null);
    setWorkflowName('');
  };

  // Load saved workflows when load dialog opens
  React.useEffect(() => {
    if (showLoadDialog) {
      const workflows = JSON.parse(localStorage.getItem('workflows') || '[]');
      setSavedWorkflows(workflows);
    }
  }, [showLoadDialog]);

  const loadWorkflow = (workflow: SavedWorkflow) => {
    setNodes(workflow.nodes);
    setEdges(workflow.edges);
    setShowLoadDialog(false);
  };

  const deleteWorkflowFromStorage = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      const updatedWorkflows = [...savedWorkflows];
      updatedWorkflows.splice(index, 1);
      localStorage.setItem('workflows', JSON.stringify(updatedWorkflows));
      setSavedWorkflows(updatedWorkflows);
    }
  };

  // Add event listeners for edge interactions
  React.useEffect(() => {
    const handleUpdateEdgeLabel = (event: CustomEvent) => {
      const { id, label } = event.detail;
      setEdges((eds) =>
        eds.map((edge) => {
          if (edge.id === id) {
            return {
              ...edge,
              data: { ...edge.data, label },
            };
          }
          return edge;
        })
      );
    };

    const handleSetEdgeDirection = (event: CustomEvent) => {
      const { id, direction } = event.detail;
      setEdges((eds) =>
        eds.map((edge) => {
          if (edge.id === id) {
            const color = edge.data?.color || '#007bff';
            return {
              ...edge,
              markerEnd: direction !== 'left' ? createMarker(color, edge.data?.arrowType) : undefined,
              markerStart: direction !== 'right' ? createMarker(color, edge.data?.arrowType) : undefined,
              data: { ...edge.data, direction },
            };
          }
          return edge;
        })
      );
    };

    const handleSetEdgeStyle = (event: CustomEvent) => {
      const { id, lineStyle } = event.detail;
      setEdges((eds) =>
        eds.map((edge) => {
          if (edge.id === id) {
            return {
              ...edge,
              data: { ...edge.data, lineStyle },
            };
          }
          return edge;
        })
      );
    };

    const handleSetArrowType = (event: CustomEvent) => {
      const { id, arrowType } = event.detail;
      setEdges((eds) =>
        eds.map((edge) => {
          if (edge.id === id) {
            const color = edge.data?.color || '#007bff';
            return {
              ...edge,
              markerEnd: edge.data?.direction !== 'left' ? createMarker(color, arrowType) : undefined,
              markerStart: edge.data?.direction !== 'right' ? createMarker(color, arrowType) : undefined,
              data: { ...edge.data, arrowType },
            };
          }
          return edge;
        })
      );
    };

    const handleSetEdgeColor = (event: CustomEvent) => {
      const { id, color } = event.detail;
      setEdges((eds) =>
        eds.map((edge) => {
          if (edge.id === id) {
            return {
              ...edge,
              markerEnd: edge.data?.direction !== 'left' ? createMarker(color, edge.data?.arrowType) : undefined,
              markerStart: edge.data?.direction !== 'right' ? createMarker(color, edge.data?.arrowType) : undefined,
              data: { ...edge.data, color },
            };
          }
          return edge;
        })
      );
    };

    const handleDeleteEdge = (event: CustomEvent) => {
      const { id } = event.detail;
      setEdges((eds) => eds.filter((edge) => edge.id !== id));
    };

    window.addEventListener('updateEdgeLabel', handleUpdateEdgeLabel as EventListener);
    window.addEventListener('setEdgeDirection', handleSetEdgeDirection as EventListener);
    window.addEventListener('setEdgeStyle', handleSetEdgeStyle as EventListener);
    window.addEventListener('setArrowType', handleSetArrowType as EventListener);
    window.addEventListener('setEdgeColor', handleSetEdgeColor as EventListener);
    window.addEventListener('deleteEdge', handleDeleteEdge as EventListener);

    return () => {
      window.removeEventListener('updateEdgeLabel', handleUpdateEdgeLabel as EventListener);
      window.removeEventListener('setEdgeDirection', handleSetEdgeDirection as EventListener);
      window.removeEventListener('setEdgeStyle', handleSetEdgeStyle as EventListener);
      window.removeEventListener('setArrowType', handleSetArrowType as EventListener);
      window.removeEventListener('setEdgeColor', handleSetEdgeColor as EventListener);
      window.removeEventListener('deleteEdge', handleDeleteEdge as EventListener);
    };
  }, [setEdges]);

  // Connect nodes with curved edges
  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return; // Guard against null values
      
      const edge: Edge = {
        id: `e${params.source}-${params.target}`,
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle || undefined,
        targetHandle: params.targetHandle || undefined,
        type: 'smoothstep',
        style: {
          strokeWidth: 2,
          stroke: '#007bff',
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#007bff',
          width: 20,
          height: 20,
        },
        animated: true,
        data: {},
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  // Custom edge style on selection
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        style: {
          ...e.style,
          stroke: e.id === edge.id ? '#0056b3' : '#007bff',
          strokeWidth: e.id === edge.id ? 3 : 2,
        },
      }))
    );
  }, [setEdges]);

  // Handle node selection
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // Add pane click handler to clear selection
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Update node data
  const onNodeUpdate = useCallback((nodeId: string, newData: any) => {
    if (newData.deleted) {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => 
        edge.source !== nodeId && edge.target !== nodeId
      ));
      setSelectedNode(null);
    } else {
      setNodes((nds) => nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: newData };
        }
        return node;
      }));
    }
  }, [setNodes, setEdges]);

  // Delete selected elements
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        setNodes((nodes) => nodes.filter((node) => !node.selected));
        setEdges((edges) => edges.filter((edge) => !edge.selected));
        setSelectedNode((prev) => 
          nodes.some(node => node.id === prev?.id) ? prev : null
        );
      }
    },
    [setNodes, setEdges, nodes]
  );

  const saveWorkflow = () => {
    if (!workflowName.trim()) {
      alert('Please enter a workflow name');
      return;
    }

    const workflow: SavedWorkflow = {
      nodes,
      edges,
      name: workflowName,
      timestamp: Date.now(),
    };

    // Get existing workflows
    const savedWorkflows = JSON.parse(localStorage.getItem('workflows') || '[]');
    
    // Add new workflow
    savedWorkflows.push(workflow);
    
    // Save back to localStorage
    localStorage.setItem('workflows', JSON.stringify(savedWorkflows));
    
    setShowSaveDialog(false);
    setWorkflowName('');
    alert('Workflow saved successfully!');
  };

  return (
    <div css={css`
      width: 100%;
      height: 100%;
      display: flex;
      position: relative;
    `}>
      <NodeSidebar onAddNode={(nodeType: string) => {
        const newNode = {
          id: `node_${Date.now()}`,
          type: 'service',
          position: { 
            x: Math.random() * window.innerWidth / 3, 
            y: Math.random() * window.innerHeight / 3 
          },
          data: { 
            label: nodeType,
            name: `${nodeType}_${Math.floor(Math.random() * 1000)}`,
            serviceType: nodeType,
            config: {
              endpoints: nodeType === 'API' ? [] : undefined,
            },
            updateNodeName: (id: string, newName: string) => {
              setNodes((nds) =>
                nds.map((node) =>
                  node.id === id
                    ? { ...node, data: { ...node.data, name: newName } }
                    : node
                )
              );
            },
            onDeleteNode: (id: string) => {
              if (window.confirm('Are you sure you want to delete this node?')) {
                setNodes((nds) => nds.filter((node) => node.id !== id));
                setEdges((eds) => eds.filter(
                  (edge) => edge.source !== id && edge.target !== id
                ));
              }
            },
          },
        };
        setNodes((nds) => nds.concat(newNode));
      }} />
      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView={false}
          deleteKeyCode={['Delete', 'Backspace']}
          nodesDraggable={true}
          nodesConnectable={true}
          snapToGrid={true}
          snapGrid={[16, 16]}
          selectNodesOnDrag={false}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.1}
          maxZoom={4}
          zoomOnScroll={true}
          panOnScroll={true}
          nodeOrigin={[0.5, 0.5]}
          panOnDrag={true}
          selectionOnDrag={false}
          preventScrolling={false}
          elevateNodesOnSelect={true}
          elevateEdgesOnSelect={true}
        >
          <Controls />
          <MiniMap 
            nodeStrokeColor="#333"
            nodeColor="#fff"
            nodeBorderRadius={8}
          />
          <Background gap={16} size={1} />
          <Panel position="top-left" style={{ margin: '10px' }}>
            <h3 style={{ 
              margin: 0, 
              padding: '10px', 
              background: 'white', 
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              Workflow Builder
            </h3>
          </Panel>
          <Panel position="top-right" style={{ padding: '10px', display: 'flex', gap: '8px' }}>
            <LoadButton onClick={() => setShowLoadDialog(true)}>
              <LoadIcon />
              Load Workflow
            </LoadButton>
            <SaveButton onClick={() => setShowSaveDialog(true)}>
              <SaveIcon />
              Save Workflow
            </SaveButton>
            <AddWorkflowButton onClick={addNewWorkflow}>
              <PlusIcon />
              New Workflow
            </AddWorkflowButton>
          </Panel>
        </ReactFlow>
        {selectedNode && (
          <ConfigPanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onUpdate={onNodeUpdate}
          />
        )}
        {showSaveDialog && (
          <>
            <Overlay onClick={() => setShowSaveDialog(false)} />
            <SaveDialog onClick={e => e.stopPropagation()}>
              <DialogTitle>Save Workflow</DialogTitle>
              <Input
                type="text"
                placeholder="Enter workflow name"
                value={workflowName}
                onChange={e => setWorkflowName(e.target.value)}
                autoFocus
              />
              <ButtonGroup>
                <Button onClick={() => setShowSaveDialog(false)}>Cancel</Button>
                <Button variant="primary" onClick={saveWorkflow}>Save</Button>
              </ButtonGroup>
            </SaveDialog>
          </>
        )}
        {showLoadDialog && (
          <>
            <Overlay onClick={() => setShowLoadDialog(false)} />
            <SaveDialog onClick={e => e.stopPropagation()}>
              <DialogTitle>Load Workflow</DialogTitle>
              <WorkflowList>
                {savedWorkflows.length === 0 ? (
                  <NoWorkflows>No saved workflows</NoWorkflows>
                ) : (
                  savedWorkflows.map((workflow, index) => (
                    <WorkflowItem 
                      key={workflow.timestamp} 
                      onClick={() => loadWorkflow(workflow)}
                    >
                      <div>
                        <WorkflowName>{workflow.name}</WorkflowName>
                        <WorkflowDate>
                          {new Date(workflow.timestamp).toLocaleString()}
                        </WorkflowDate>
                      </div>
                      <Button 
                        onClick={(e) => deleteWorkflowFromStorage(index, e)}
                        style={{ padding: '4px 8px' }}
                      >
                        Delete
                      </Button>
                    </WorkflowItem>
                  ))
                )}
              </WorkflowList>
              <ButtonGroup>
                <Button onClick={() => setShowLoadDialog(false)}>Close</Button>
              </ButtonGroup>
            </SaveDialog>
          </>
        )}
        {showRenameDialog && (
          <>
            <Overlay onClick={() => setShowRenameDialog(false)} />
            <SaveDialog onClick={e => e.stopPropagation()}>
              <DialogTitle>Rename Workflow</DialogTitle>
              <Input
                type="text"
                placeholder="Enter workflow name"
                value={workflowName}
                onChange={e => setWorkflowName(e.target.value)}
                autoFocus
              />
              <ButtonGroup>
                <Button onClick={() => setShowRenameDialog(false)}>Cancel</Button>
                <Button variant="primary" onClick={renameWorkflow}>Rename</Button>
              </ButtonGroup>
            </SaveDialog>
          </>
        )}
      </div>
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <WorkflowBuilder />
  </ReactFlowProvider>
);
