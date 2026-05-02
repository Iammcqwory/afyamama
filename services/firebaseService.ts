import { db, handleFirestoreError, OperationType } from './firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { Message, Sender } from '../types';

export const saveMessage = async (sessionId: string, text: string, sender: Sender, imageUrl?: string) => {
  const path = `chatSessions/${sessionId}/messages`;
  try {
    await addDoc(collection(db, path), {
      sessionId,
      text,
      sender,
      timestamp: serverTimestamp(),
      imageUrl: imageUrl || null
    });
    
    // Update session timestamp
    await updateDoc(doc(db, 'chatSessions', sessionId), {
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const createChatSession = async (userId: string, title: string) => {
  const path = 'chatSessions';
  try {
    const docRef = await addDoc(collection(db, path), {
      userId,
      title,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const getChatSessions = async (userId: string) => {
  const path = 'chatSessions';
  try {
    const q = query(
      collection(db, path),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
};

export const getBabyProfiles = async (userId: string) => {
  const path = 'babies';
  try {
    const q = query(
      collection(db, path),
      where('ownerId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
};

export const subscribeToMessages = (sessionId: string, callback: (messages: Message[]) => void) => {
  const path = `chatSessions/${sessionId}/messages`;
  const q = query(collection(db, path), orderBy('timestamp', 'asc'));
  
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        text: data.text,
        sender: data.sender,
        timestamp: data.timestamp?.toMillis() || Date.now(),
        imageUrl: data.imageUrl,
        reactions: data.reactions
      } as Message;
    });
    callback(messages);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};
