import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faCalendar,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";

import { useSelector, useDispatch } from "react-redux";
import {
  getUser,
  addTask,
  updateTask,
  deleteTask,
} from "../redux/actions/taskActions";

import TimePicker from "react-time-range";
import moment from "moment";

const Task = () => {
  const [showForm, setShowForm] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(moment());
  const [endTime, setEndTime] = useState(moment());
  const [value, setValue] = useState("");
  const [desc, setDesc] = useState("");
  const [operations, setOperations] = useState("create");
  const [selectedItem, setSelectedItem] = useState({});

  const { tasks, dropdownUser, user } = useSelector(
    (state) => state.taskReducer
  );

  const handleEdit = (item) => {
    setShowForm(true);
    setSelectedItem(item);
    console.log(item);
    setOperations("edit");
    setDesc(item.task_msg);
    setStartTime(item.task_time);
  };

  const dispatch = useDispatch();

  const formatOptionLabel = ({ value, label }) => (
    <div style={{ display: "flex" }}>
      <div>{label}</div>
    </div>
  );

  const handleShowForm = () => {
    setShowForm(!showForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const date = new Date();

    const offset = date.getTimezoneOffset();

    const timeZone = -offset * 60;

    let data = {
      dataObj: {
        assigned_user: value.value,
        task_date: moment(startDate).format("YYYY-MM-DD"),
        task_time: new Date(startTime).getTime(),
        is_completed: 0,
        time_zone: timeZone,
        task_msg: desc,
      },
      company_id: user.company_id,
      token: user.token,
    };

    dispatch(addTask(data));
    setShowForm(false);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    let data = {
      company_id: user.company_id,
      token: user.token,
      taskId: item.id,
    };

    dispatch(deleteTask(data));
    setShowForm(false);
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const date = new Date();

    const offset = date.getTimezoneOffset();

    const timeZone = -offset * 60;

    let data = {
      dataObj: {
        assigned_user: value.value,
        task_date: moment(startDate).format("YYYY-MM-DD"),
        task_time: new Date(startTime).getTime(),
        is_completed: 0,
        time_zone: timeZone,
        task_msg: desc,
      },
      company_id: user.company_id,
      token: user.token,
      taskId: selectedItem.id,
    };

    dispatch(updateTask(data));
    setShowForm(false);
  };

  const returnFunctionStart = (event) => {
    setStartTime({
      startTime: event.startTime,
    });
  };

  const returnFunctionEnd = (event) => {
    setEndTime({ endTime: event.endTime });
  };
  const handleSelect = (e) => {
    console.log(e);
    setValue({
      value: e.value,
    });
  };

  useEffect(() => {
    dispatch(getUser());
  }, []);
  return (
    <div className="wrapper">
      <div className="taskContainer">
        <div className="taskHeader">
          <div className="taskBoard">
            <p>TASKS</p>
            <p style={{ marginLeft: "5px" }}>{tasks.length}</p>
          </div>
          {operations === "create" ? (
            <div onClick={handleShowForm} className="actionWrapper">
              <p className="plusIcon">+</p>
            </div>
          ) : (
            <div onClick={handleShowForm} className="actionWrapper">
              <p className="plusIcon">x</p>
            </div>
          )}
        </div>
        <div className="taskBody">
          {showForm ? (
            <>
              <div>
                <form>
                  <div className="description">
                    <label>Task Description</label>
                    <div className="inputWrapper">
                      <FontAwesomeIcon icon={faBook} className="iconItem" />
                      <input
                        id="name"
                        value={desc}
                        className="descInput"
                        type="text"
                        onChange={(e) => setDesc(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="timeWrapper">
                    <div className="dateWrapper">
                      <FontAwesomeIcon icon={faCalendar} className="dateIcon" />
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        className="datePicker"
                      />
                    </div>
                    <div>
                      <TimePicker
                        className="col-sm-6"
                        onStartTimeChange={returnFunctionStart}
                        onEndTimeChange={returnFunctionEnd}
                        startMoment={startTime}
                        endMoment={endTime}
                      />
                    </div>
                  </div>
                  <div className="selectWrapper">
                    <label>Assign User</label>
                    <Select
                      formatOptionLabel={formatOptionLabel}
                      options={dropdownUser}
                      onChange={(e) => handleSelect(e)}
                    />
                  </div>
                  <div className="buttonWrapper">
                    <button className="closeBtn">Cancel</button>
                    {operations === "create" ? (
                      <button
                        type="button"
                        onClick={handleSubmit}
                        className="saveBtn"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={handleUpdate}
                        type="button"
                        className="saveBtn"
                      >
                        Update
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </>
          ) : (
            <>
              {tasks.length > 0 &&
                tasks.map((task) => {
                  let taskUser;
                  if (dropdownUser.length > 0) {
                    taskUser = dropdownUser.filter(
                      (userItem) => userItem.id !== task.assigned_user
                    );
                  } else {
                    taskUser = {
                      value: "",
                      label: "",
                      icon: "http://www.gravatar.com/avatar/8819dc24c18e9a4671a832c8254b8cc1?default=https%3A%2F%2Fs3.sloovi.com%2Favatar-default-icon.png",
                    };
                  }

                  return (
                    <div key={task.id} className="taskItemBody">
                      <div className="taskItem">
                        <div className="left">
                          {" "}
                          <div>
                            <img
                              src="http://www.gravatar.com/avatar/cf94b74bd41b466bb185bd4d674f032b?default=https%3A%2F%2Fs3.sloovi.com%2Favatar-default-icon.png"
                              height="40px"
                              alt=""
                            />
                          </div>
                          <div className="itemText">
                            <p>{task.task_msg}</p>
                            <p className="itemSpan">{task.task_date}</p>
                          </div>
                        </div>
                        <div className="icons">
                          <FontAwesomeIcon
                            onClick={() => handleEdit(task)}
                            className="iconPen"
                            icon={faPen}
                          />
                          <FontAwesomeIcon
                            onClick={() => handleDelete(task)}
                            className="iconTrash"
                            icon={faTrash}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Task;
