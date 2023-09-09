import {setAppStatusAC} from "../../app/app-reducer";
import {todolistsAPI} from "../../api/todolists-api";
import {handleServerNetworkErrorSaga} from "../../utils/error-utils";
import {setTodolistsAC} from "./todolists-reducer";
import {call, put, takeEvery} from "redux-saga/effects";


export const fetchTodolists = () => ({type: "TODOLISTS/SET-TODOLISTS"})

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

//
// export const removeTodolistTC = (todolistId: string) => {
//     return (dispatch: ThunkDispatch) => {
//         //изменим глобальный статус приложения, чтобы вверху полоса побежала
//         dispatch(setAppStatusAC('loading'))
//         //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
//         dispatch(changeTodolistEntityStatusAC(todolistId, 'loading'))
//         todolistsAPI.deleteTodolist(todolistId)
//             .then((res) => {
//                 dispatch(removeTodolistAC(todolistId))
//                 //скажем глобально приложению, что асинхронная операция завершена
//                 dispatch(setAppStatusAC('succeeded'))
//             })
//     }
// }
// export const addTodolistTC = (title: string) => {
//     return (dispatch: ThunkDispatch) => {
//         dispatch(setAppStatusAC('loading'))
//         todolistsAPI.createTodolist(title)
//             .then((res) => {
//                 dispatch(addTodolistAC(res.data.data.item))
//                 dispatch(setAppStatusAC('succeeded'))
//             })
//     }
// }
// export const changeTodolistTitleTC = (id: string, title: string) => {
//     return (dispatch: Dispatch<ActionsType>) => {
//         todolistsAPI.updateTodolist(id, title)
//             .then((res) => {
//                 dispatch(changeTodolistTitleAC(id, title))
//             })
//     }
// }

export function* todolistsWatcherSaga() {
    yield takeEvery("TODOLISTS/SET-TODOLISTS", fetchTodolistsWorkerSaga)
}