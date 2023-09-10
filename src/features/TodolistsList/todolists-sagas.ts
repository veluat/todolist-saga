import {setAppStatusAC} from "../../app/app-reducer";
import {todolistsAPI} from "../../api/todolists-api";
import {handleServerNetworkErrorSaga} from "../../utils/error-utils";
import {
    addTodolistAC,
    changeTodolistEntityStatusAC,
    changeTodolistTitleAC,
    removeTodolistAC,
    setTodolistsAC
} from "./todolists-reducer";
import {call, put, takeEvery} from "redux-saga/effects";
import {addTask, addTaskWorkerSaga} from "./Todolist/tasks-sagas";


export function* fetchTodolistsWorkerSaga(action: ReturnType<typeof fetchTodolists>) {
    yield put(setAppStatusAC('loading'))
    try {
        const res = yield call(todolistsAPI.getTodolists)
        yield put(setTodolistsAC(res.data))
        yield put(setAppStatusAC('succeeded'))
    } catch (error) {
        handleServerNetworkErrorSaga(error)
    }
}

export const fetchTodolists = () => ({type: "TODOLISTS/SET-TODOLISTS"})

export function* removeTodolistWorkerSaga(action: ReturnType<typeof removeTodolist>) {
    yield put(setAppStatusAC('loading'))
    yield put(changeTodolistEntityStatusAC(action.todolistId, 'loading'))

    yield call(todolistsAPI.deleteTodolist, action.todolistId)
    yield put(removeTodolistAC(action.todolistId))
    yield put(setAppStatusAC('succeeded'))
}


export const removeTodolist = (todolistId: string) => ({type: "TODOLISTS/REMOVE-TODOLISTS", todolistId})

export const addTodolist = (title: string) => ({type: "TODOLISTS/ADD-TODOLISTS", title})

 export function* addTodolistWorkerSaga(action: ReturnType<typeof addTodolist>) {
     yield put(setAppStatusAC('loading'))
     const res = yield call(todolistsAPI.createTodolist, action.title)
     yield put(addTodolistAC(res.data.data.item))
     yield put(setAppStatusAC('succeeded'))

}

export const changeTodolist = (id: string, title: string) => ({type: "TODOLISTS/CHANGE-TITLE-TODOLIST", id, title})

export function* changeTodolistTitleWorkerSaga(action: ReturnType<typeof changeTodolist>) {
    const res = yield call(todolistsAPI.updateTodolist, action.id, action.title)
    yield put(changeTodolistTitleAC(action.id, action.title))
}

export function* todolistsWatcherSaga() {
    yield takeEvery("TODOLISTS/SET-TODOLISTS", fetchTodolistsWorkerSaga)
    yield takeEvery("TODOLISTS/REMOVE-TODOLISTS", removeTodolistWorkerSaga)
    yield takeEvery("TODOLISTS/ADD-TODOLISTS", addTodolistWorkerSaga)
    yield takeEvery("TODOLISTS/CHANGE-TITLE-TODOLIST", changeTodolistTitleWorkerSaga)
}