import { useAppContext } from "../context/appContext";
import { useEffect } from "react";
import Loading from "./Loading";
import Task from "./Task";
import Alert from "./Alert";
import Wrapper from "../assets/wrappers/TasksContainer";
import PageBtnContainer from "./PageBtnContainer";

const TasksContainer = () => {
  const {
    getTasks,
    tasks,
    isLoading,
    page,
    totalTasks,
    search,
    searchStatus,
    searchType,
    sort,
    numOfPages,
    showAlert,
  } = useAppContext();
  useEffect(() => {
    getTasks();
    // eslint-disable-next-line
  }, [page, search, searchStatus, searchType, sort]);
  if (isLoading) {
    return <Loading center />;
  }

  if (tasks.length === 0) {
    return (
      <Wrapper>
        <h2>No tasks to display...</h2>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {showAlert && <Alert />}
      <h5>
        {totalTasks} task{tasks.length > 1 && "s"} found
      </h5>
      <div className="tasks">
        {tasks.map((task) => {
          return <Task key={task._id} {...task} />;
        })}
      </div>
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  );
};

export default TasksContainer;
