import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/shared/authSlice';
import notificationReducer from '@/features/shared/notificationSlice';
import userReducer from '@/features/shared/userSlice';
import sidebarReducer from '@/features/shared/sidebarSlice';

// module reducer
import contactReducer from "@/features/contactSlice"
 

//master table
import slotReducer from '@/features/master/slotMasterSlice';
import serviceReducer from '@/features/master/serviceMasterSlice';
import industriesReducer from '@/features/master/industriesMasterSlice';

const store = configureStore({
  reducer: {
    sidebar:sidebarReducer,
  //shared reducers
  auth: authReducer,
  notifications: notificationReducer,
  user: userReducer,

  // module reducer
  contact:contactReducer,

  //master
  slots: slotReducer,
  services: serviceReducer,
  industries:industriesReducer,
  },
})
export default store;