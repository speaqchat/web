import create from "zustand";
import { persist } from "zustand/middleware";
import { Conversation } from "../types";

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  profilePicture?: any;
  createdAt: Date;
  updatedAt: Date;
}

interface StateTypes {
  auth: {
    user: User;
    token: string;
  } | null;
  login: (data: any) => void;
  logout: () => void;
  settings: {
    darkMode: boolean;
  };
  toggleTheme: () => void;
}

export const useStore = create(
  persist<StateTypes>(
    (set) => ({
      // Initial state
      auth: null,
      settings: {
        darkMode: true,
      },

      // Mutate methods
      login: async (data: any) => {
        set({ auth: data });
      },
      logout: () => {
        set(() => {
          return { auth: null };
        });
      },
      toggleTheme: () => {
        set((state) => {
          return {
            settings: {
              darkMode: !state.settings.darkMode,
            },
          };
        });
      },
    }),
    {
      name: "store",
    }
  )
);

interface PinnedStore {
  pinnedConversations: Conversation[] | null;
  addPinnedConversation: (conversation: any) => void;
  removePinnedConversation: (conversation: any) => void;
  clearPinned: () => void;
}

export const usePinnedStore = create<PinnedStore>((set) => ({
  pinnedConversations: null,
  addPinnedConversation(conversation: Conversation) {
    set((state) => {
      return {
        pinnedConversations: [
          ...(state.pinnedConversations || []),
          conversation,
        ],
      };
    });
  },
  removePinnedConversation(conversation: Conversation) {
    set((state) => {
      return {
        pinnedConversations: state.pinnedConversations?.filter(
          (c) => c.id !== conversation.id
        ),
      };
    });
  },
  clearPinned() {
    set(() => {
      return {
        pinnedConversations: null
      }
    })
  }
}));
