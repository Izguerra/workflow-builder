import { Node, Edge, NodeProps, EdgeProps } from 'reactflow';

export interface ServiceNodeConfig {
  endpoints?: string[];
}

export interface ServiceNodeData {
  name?: string;
  label: string;
  serviceType: string;
  config?: ServiceNodeConfig;
  updateNodeName?: (id: string, newName: string) => void;
  onDeleteNode?: (id: string) => void;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  userId: string;
  nodes: Node[];
  edges: Edge[];
  isPublic: boolean;
  tags?: string[];
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  workflowIds: string[];
  settings?: UserSettings;
}

export interface UserSettings {
  theme?: 'light' | 'dark';
  notifications?: boolean;
  defaultWorkflowVisibility?: 'public' | 'private';
}

export interface WorkflowShare {
  id: string;
  workflowId: string;
  sharedByUserId: string;
  sharedWithUserId: string;
  permissions: 'view' | 'edit';
  createdAt: Date | null;
}

export interface WorkflowVersion {
  id: string;
  workflowId: string;
  version: number;
  nodes: Node[];
  edges: Edge[];
  createdAt: Date | null;
  createdBy: string;
  description?: string;
}
