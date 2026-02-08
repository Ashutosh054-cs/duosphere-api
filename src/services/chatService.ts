import { apiFetch } from '@lib/api';
import { Message, DirectMessage } from '@/types';

export const sendMessage = async (
  groupId: string,
  _senderId: string,
  _senderName: string,
  content: string,
  type: Message['type'] = 'text'
): Promise<Message> => {
  const data = await apiFetch<{ message: Message }>(`/groups/${groupId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ content, type }),
  });
  return data.message;
};

export const getMessages = async (
  _groupId: string
): Promise<{ messages: Message[]; lastDoc: null }> => {
  return { messages: [], lastDoc: null };
};

export const subscribeToMessages = (
  _groupId: string,
  _callback: (message: Message) => void
): (() => void) => {
  return () => {};
};

export const markMessagesAsRead = async (
  _groupId: string,
  _messageIds: string[],
  _userId: string
): Promise<void> => {
  return;
};

export const sendDirectMessage = async (
  _senderId: string,
  _receiverId: string,
  _content: string
): Promise<DirectMessage> => {
  throw new Error('Direct messages are not implemented yet');
};

export const getDirectMessages = async (
  _userId1: string,
  _userId2: string
): Promise<DirectMessage[]> => {
  return [];
};

export const subscribeToDirectMessages = (
  _userId1: string,
  _userId2: string,
  _callback: (message: DirectMessage) => void
): (() => void) => {
  return () => {};
};

export const markDirectMessageAsRead = async (_messageId: string): Promise<void> => {
  return;
};
