import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TaskStatus } from '../../types';

export interface FiltersState {
  status: TaskStatus | 'all';
  assigneeId: string | 'all';
}

const initialState: FiltersState = {
  status: 'all',
  assigneeId: 'all',
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    statusFilterChanged(state, action: PayloadAction<FiltersState['status']>) {
      state.status = action.payload;
    },
    assigneeFilterChanged(state, action: PayloadAction<FiltersState['assigneeId']>) {
      state.assigneeId = action.payload;
    },
    filtersCleared(state) {
      state.status = 'all';
      state.assigneeId = 'all';
    },
  },
});

export const { statusFilterChanged, assigneeFilterChanged, filtersCleared } = filtersSlice.actions;
export default filtersSlice.reducer;
