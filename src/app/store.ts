import { tasksReducer} from '../features/TodolistsList/tasks-reducer';
import {todolistsReducer} from '../features/TodolistsList/todolists-reducer';
import {applyMiddleware, combineReducers, createStore} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {appReducer, initializeAppWorkerSaga} from './app-reducer'
import {authReducer} from '../features/Login/auth-reducer'
import createSagaMiddleware from 'redux-saga'
import {takeEvery} from 'redux-saga/effects'
import {
    addTaskWorkerSaga,
    fetchTasksWorkerSaga,
    removeTaskWorkerSaga, tasksWatcherSaga
} from "../features/TodolistsList/Todolist/tasks-sagas";
import {todolistsWatcherSaga} from "../features/TodolistsList/todolists-sagas";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer
})

const sagaMiddleware = createSagaMiddleware()

export const store = createStore(rootReducer, applyMiddleware(thunkMiddleware, sagaMiddleware));

export type AppRootStateType = ReturnType<typeof rootReducer>

sagaMiddleware.run(rootWatcher)

function* rootWatcher() {
    yield takeEvery("APP/INITIALED-APP", initializeAppWorkerSaga)
    yield tasksWatcherSaga()
    yield todolistsWatcherSaga()
}


// @ts-ignore
window.store = store;
