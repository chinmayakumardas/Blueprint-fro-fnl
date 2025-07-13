import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/shared/authSlice';
// import notificationReducer from './features/shared/notificationSlice';
// import userReducer from './features/shared/userSlice';


 const store = configureStore({
  reducer: {
  //shared reducers
  auth: authReducer,
  // notifications: notificationReducer,
  // user: userReducer,

  
  
  },
})
export default store;