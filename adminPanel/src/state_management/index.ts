import {
  applyMiddleware,
  combineReducers,
  createStore,
  Middleware,
  Reducer,
} from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { thunk } from "redux-thunk";
import logger from "redux-logger";
import AuthReducer from "./reducers/authReducer";

// Combine reducers
const appReducer = combineReducers({
    AuthReducer,

});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(
  persistConfig,
  appReducer as Reducer<unknown, never>
);

const store = createStore(
  persistedReducer,
  applyMiddleware(thunk as Middleware, logger as Middleware)
);

persistStore(store);
export default store;

export type RootState = ReturnType<typeof appReducer>;
