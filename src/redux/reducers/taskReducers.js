import {
  ADD_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  GET_USER,
  GET_DROPDOWN_USER,
  GET_ALL_TASKS,
} from "../types/taskTypes";

const initialState = {
  tasks: [],
  user: [],
  dropdownUser: {},
};

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case GET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case GET_ALL_TASKS:
      return {
        ...state,
        tasks: action.payload,
      };
    case GET_DROPDOWN_USER:
      return {
        ...state,
        dropdownUser: action.payload,
      };
    case DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((item) => item.id !== action.payload),
      };

    case UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task.id === action.payload.id) {
            task.assigned_user = action.payload.assigned_user;
            task.task_date = action.payload.task_date;
            task.task_time = action.payload.task_time;
            task.task_msg = action.payload.task_msg;
          }
          return task;
        }),
      };

    default:
      return state;
  }
};

export default taskReducer;
