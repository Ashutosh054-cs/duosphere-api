import { create } from 'zustand';
import { Message, DirectMessage, TypingIndicator } from '@/types';

interface ChatState {
  messages: Record<string, Message[]>; // groupId -> messages[]
  directMessages: Record<string, DirectMessage[]>; // conversationId -> messages[]
  typingIndicators: Record<string, TypingIndicator[]>; // groupId -> typing users[]
  unreadCounts: Record<string, number>; // groupId/conversationId -> count
  loading: boolean;

  setMessages: (groupId: string, messages: Message[]) => void;
  addMessage: (groupId: string, message: Message) => void;
  setDirectMessages: (conversationId: string, messages: DirectMessage[]) => void;
  addDirectMessage: (conversationId: string, message: DirectMessage) => void;
  setTypingIndicator: (groupId: string, indicator: TypingIndicator) => void;
  removeTypingIndicator: (groupId: string, userId: string) => void;
  markAsRead: (groupId: string, messageIds: string[]) => void;
  setUnreadCount: (id: string, count: number) => void;
  incrementUnreadCount: (id: string) => void;
  resetUnreadCount: (id: string) => void;
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: {},
  directMessages: {},
  typingIndicators: {},
  unreadCounts: {},
  loading: false,

  setMessages: (groupId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [groupId]: messages },
    })),

  addMessage: (groupId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [groupId]: [...(state.messages[groupId] || []), message],
      },
    })),

  setDirectMessages: (conversationId, messages) =>
    set((state) => ({
      directMessages: { ...state.directMessages, [conversationId]: messages },
    })),

  addDirectMessage: (conversationId, message) =>
    set((state) => ({
      directMessages: {
        ...state.directMessages,
        [conversationId]: [...(state.directMessages[conversationId] || []), message],
      },
    })),

  setTypingIndicator: (groupId, indicator) =>
    set((state) => {
      const existing = state.typingIndicators[groupId] || [];
      const filtered = existing.filter((t) => t.userId !== indicator.userId);
      return {
        typingIndicators: {
          ...state.typingIndicators,
          [groupId]: [...filtered, indicator],
        },
      };
    }),

  removeTypingIndicator: (groupId, userId) =>
    set((state) => ({
      typingIndicators: {
        ...state.typingIndicators,
        [groupId]: (state.typingIndicators[groupId] || []).filter(
          (t) => t.userId !== userId
        ),
      },
    })),

  markAsRead: (groupId, messageIds) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [groupId]: (state.messages[groupId] || []).map((msg) =>
          messageIds.includes(msg.id) ? { ...msg, readBy: [...msg.readBy] } : msg
        ),
      },
    })),

  setUnreadCount: (id, count) =>
    set((state) => ({
      unreadCounts: { ...state.unreadCounts, [id]: count },
    })),

  incrementUnreadCount: (id) =>
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [id]: (state.unreadCounts[id] || 0) + 1,
      },
    })),

  resetUnreadCount: (id) =>
    set((state) => ({
      unreadCounts: { ...state.unreadCounts, [id]: 0 },
    })),

  reset: () =>
    set({
      messages: {},
      directMessages: {},
      typingIndicators: {},
      unreadCounts: {},
      loading: false,
    }),
}));
