import { create } from 'zustand';
interface RefetchState {
  refetch: number;
  setRefetch: (refetch: number) => void;
}
const useRefetchStore = create<RefetchState>((set) => ({
  refetch: 0,
  setRefetch: (refetch) => {
    set({ refetch });
  },
}));



export default useRefetchStore;
