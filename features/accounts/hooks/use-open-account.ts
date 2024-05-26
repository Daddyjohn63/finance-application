//hook managing state when editing an account.
import { create } from 'zustand';

type OpenAccountState = {
  id?: string;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
};

export const useOpenAccount = create<OpenAccountState>(set => ({
  //immediately returns an object
  id: undefined,
  isOpen: false,
  onOpen: (id: string) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: undefined })
}));
