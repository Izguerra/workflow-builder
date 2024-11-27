import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  createWorkflow,
  getUserWorkflows,
  createUser,
  getUser,
  deleteWorkflow,
} from '../services/firestore';
import type { Workflow } from '../types';

const TestFirestore: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [lastCreated, setLastCreated] = useState<number>(0);

  const fetchWorkflows = async () => {
    if (!currentUser) return;
    try {
      const userWorkflows = await getUserWorkflows(currentUser.uid);
      setWorkflows(userWorkflows);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  useEffect(() => {
    const initializeUser = async () => {
      if (!currentUser) return;
      
      try {
        // Check if user exists in Firestore
        const userDoc = await getUser(currentUser.uid);
        if (!userDoc) {
          // Create user document if it doesn't exist
          await createUser(currentUser.uid, currentUser.email || '');
        }

        await fetchWorkflows();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, [currentUser]);

  const handleCreateWorkflow = async () => {
    if (!currentUser || creating) return;

    const now = Date.now();
    if (now - lastCreated < 1000) {
      setError('Please wait a moment before creating another workflow');
      return;
    }

    try {
      setCreating(true);
      setError(null);
      const timestamp = new Date().toISOString().slice(11, 19); // Get time in HH:MM:SS format
      const newWorkflow = {
        name: `Test Workflow (${timestamp})`,
        description: 'This is a test workflow',
        userId: currentUser.uid,
        nodes: [],
        edges: [],
        isPublic: false,
        tags: ['test'],
      };

      const workflowId = await createWorkflow(newWorkflow);
      setLastCreated(now);
      await fetchWorkflows();
      
      // Navigate to the workflow builder
      navigate(`/workflow/${workflowId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteWorkflow = async (workflowId: string) => {
    if (!currentUser) return;

    try {
      setError(null);
      await deleteWorkflow(workflowId);
      await fetchWorkflows();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!currentUser) return <div>Please log in to continue</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Test Firestore Integration</h2>
      
      {error && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '10px', 
          backgroundColor: '#ffebee', 
          color: '#c62828',
          borderRadius: '4px' 
        }}>
          {error}
        </div>
      )}

      <button 
        onClick={handleCreateWorkflow}
        disabled={creating}
        style={{
          padding: '8px 16px',
          backgroundColor: creating ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: creating ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {creating ? 'Creating...' : 'Create Test Workflow'}
      </button>
      
      <h3>Your Workflows ({workflows.length})</h3>
      {workflows.length === 0 ? (
        <p>No workflows found</p>
      ) : (
        <div>
          {workflows.map((workflow) => (
            <div 
              key={workflow.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                marginBottom: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                backgroundColor: '#f8f9fa',
                cursor: 'pointer'
              }}
            >
              <div 
                onClick={() => navigate(`/workflow/${workflow.id}`)}
                style={{ flex: 1 }}
              >
                <strong>{workflow.name}</strong>
                <p style={{ margin: '4px 0 0 0', color: '#666' }}>
                  {workflow.description}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/workflow/${workflow.id}`);
                  }}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Open
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteWorkflow(workflow.id);
                  }}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestFirestore;
