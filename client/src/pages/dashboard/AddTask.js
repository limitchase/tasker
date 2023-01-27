import { FormRow, FormRowSelect, Alert } from "../../components";
import { useAppContext } from "../../context/appContext";
import Wrapper from "../../assets/wrappers/DashboardFormPage";

const AddTask = () => {
  const {
    isLoading,
    isEditing,
    showAlert,
    displayAlert,
    description,
    client,
    taskLocation,
    taskType,
    taskTypeOptions,
    status,
    statusOptions,
    handleChange,
    clearValues,
    createTask,
    editTask,
  } = useAppContext();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!description || !client || !taskLocation) {
      displayAlert();
      return;
    }
    if (isEditing) {
      editTask();
      return;
    }
    createTask();
  };
  const handleTaskInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    handleChange({ name, value });
  };

  return (
    <Wrapper>
      <form className="form">
        <h3>{isEditing ? "edit task" : "add task"}</h3>
        {showAlert && <Alert />}
        <div className="form-center">
          {/* description */}
          <FormRow
            type="text"
            name="description"
            value={description}
            handleChange={handleTaskInput}
          />
          {/* client */}
          <FormRow
            type="text"
            name="client"
            value={client}
            handleChange={handleTaskInput}
          />
          {/* location */}
          <FormRow
            type="text"
            labelText="task location"
            name="taskLocation"
            value={taskLocation}
            handleChange={handleTaskInput}
          />
          {/* task status */}
          <FormRowSelect
            name="status"
            value={status}
            handleChange={handleTaskInput}
            list={statusOptions}
          />
          {/* task type */}
          <FormRowSelect
            name="taskType"
            labelText="task type"
            value={taskType}
            handleChange={handleTaskInput}
            list={taskTypeOptions}
          />
          {/* btn container */}
          <div className="btn-container">
            <button
              type="submit"
              className="btn btn-block submit-btn"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              submit
            </button>
            <button
              className="btn btn-block clear-btn"
              onClick={(e) => {
                e.preventDefault();
                clearValues();
              }}
            >
              clear
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

export default AddTask;
