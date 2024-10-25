import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/auth';
import reportReducer from './reducers/reports'
import { initializeAuth } from './actions/authActions';

const store =  configureStore({
            reducer: {
                auth:authReducer,
                report:reportReducer
            },
        });
store.dispatch(initializeAuth())
export default store;

  