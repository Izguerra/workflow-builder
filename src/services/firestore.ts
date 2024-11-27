import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import type { Workflow, User, WorkflowShare, WorkflowVersion } from '../types';

const convertTimestampToDate = (timestamp: any): Date | null => {
  if (!timestamp) return null;
  return timestamp.toDate();
};

// User Operations
export const createUser = async (userId: string, email: string) => {
  const userRef = doc(db, 'users', userId);
  const userData: Partial<User> = {
    id: userId,
    email,
    createdAt: serverTimestamp() as any,
    updatedAt: serverTimestamp() as any,
    workflowIds: [],
    settings: {
      theme: 'light',
      notifications: true,
      defaultWorkflowVisibility: 'private'
    }
  };
  await setDoc(userRef, userData);
};

export const getUser = async (userId: string): Promise<User | null> => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  if (!userDoc.exists()) return null;
  
  const data = userDoc.data();
  return {
    ...data,
    createdAt: convertTimestampToDate(data.createdAt),
    updatedAt: convertTimestampToDate(data.updatedAt),
  } as User;
};

// Workflow Operations
export const createWorkflow = async (workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>) => {
  const workflowData = {
    ...workflow,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, 'workflows'), workflowData);
  return docRef.id;
};

export const getWorkflow = async (workflowId: string): Promise<Workflow | null> => {
  const workflowRef = doc(db, 'workflows', workflowId);
  const workflowDoc = await getDoc(workflowRef);
  if (!workflowDoc.exists()) return null;
  
  const data = workflowDoc.data();
  return {
    ...data,
    id: workflowId,
    createdAt: convertTimestampToDate(data.createdAt),
    updatedAt: convertTimestampToDate(data.updatedAt),
  } as Workflow;
};

export const getUserWorkflows = async (userId: string): Promise<Workflow[]> => {
  const q = query(
    collection(db, 'workflows'),
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
    createdAt: convertTimestampToDate(doc.data().createdAt),
    updatedAt: convertTimestampToDate(doc.data().updatedAt),
  } as Workflow));
};

export const updateWorkflow = async (workflowId: string, updates: Partial<Workflow>) => {
  const workflowRef = doc(db, 'workflows', workflowId);
  await updateDoc(workflowRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const deleteWorkflow = async (workflowId: string) => {
  await deleteDoc(doc(db, 'workflows', workflowId));
};

// Workflow Sharing Operations
export const shareWorkflow = async (workflowId: string, sharedByUserId: string, sharedWithUserId: string, permissions: 'view' | 'edit') => {
  const shareData: Omit<WorkflowShare, 'id'> = {
    workflowId,
    sharedByUserId,
    sharedWithUserId,
    permissions,
    createdAt: serverTimestamp() as any,
  };
  await addDoc(collection(db, 'workflowShares'), shareData);
};

export const getSharedWorkflows = async (userId: string): Promise<Workflow[]> => {
  const q = query(
    collection(db, 'workflowShares'),
    where('sharedWithUserId', '==', userId)
  );
  const querySnapshot = await getDocs(q);
  const sharedWorkflows: Workflow[] = [];

  for (const doc of querySnapshot.docs) {
    const share = {
      ...doc.data(),
      id: doc.id,
      createdAt: convertTimestampToDate(doc.data().createdAt),
    } as WorkflowShare;
    
    const workflow = await getWorkflow(share.workflowId);
    if (workflow) {
      sharedWorkflows.push(workflow);
    }
  }

  return sharedWorkflows;
};

// Workflow Versioning Operations
export const createWorkflowVersion = async (workflowId: string, nodes: any[], edges: any[], createdBy: string, description?: string) => {
  const versionsQuery = query(
    collection(db, 'workflowVersions'),
    where('workflowId', '==', workflowId),
    orderBy('version', 'desc'),
  );
  const versionsSnapshot = await getDocs(versionsQuery);
  const latestVersion = versionsSnapshot.empty ? 0 : versionsSnapshot.docs[0].data().version;

  const versionData: Omit<WorkflowVersion, 'id'> = {
    workflowId,
    version: latestVersion + 1,
    nodes,
    edges,
    createdAt: serverTimestamp() as any,
    createdBy,
    description,
  };

  await addDoc(collection(db, 'workflowVersions'), versionData);
};

export const getWorkflowVersions = async (workflowId: string): Promise<WorkflowVersion[]> => {
  const q = query(
    collection(db, 'workflowVersions'),
    where('workflowId', '==', workflowId),
    orderBy('version', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
    createdAt: convertTimestampToDate(doc.data().createdAt),
  } as WorkflowVersion));
};
