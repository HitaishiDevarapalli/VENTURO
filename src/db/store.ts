import { configureStore, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Theme state interface
interface ThemeState {
  darkMode: boolean;
}

const initialThemeState: ThemeState = {
  darkMode: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: initialThemeState,
  reducers: {
    toggleTheme(state) {
      state.darkMode = !state.darkMode;
    },
    setTheme(state, action: PayloadAction<boolean>) {
      state.darkMode = action.payload;
    },
  },
});

// Notifications state interface
interface NotificationItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface NotificationState {
  items: NotificationItem[];
}

const initialNotificationState: NotificationState = {
  items: [],
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: initialNotificationState,
  reducers: {
    addNotification(state, action: PayloadAction<Omit<NotificationItem, 'id'>>) {
      const id = Date.now().toString();
      state.items.push({ ...action.payload, id });
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export const { addNotification, removeNotification } = notificationSlice.actions;

export const store = configureStore({
  reducer: {
    theme: themeSlice.reducer,
    notifications: notificationSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
