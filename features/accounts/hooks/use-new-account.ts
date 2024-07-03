import { create } from 'zustand';

type NewAccountState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewAccount = create<NewAccountState>(set => ({
  //immediately returns an object
  isOpen: false, //sets the state default
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));
