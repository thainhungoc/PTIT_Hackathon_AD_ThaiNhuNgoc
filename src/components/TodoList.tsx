import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Navbar, Modal } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Delete, Edit } from "@mui/icons-material";

interface ITodo {
  id: number;
  name: string;
  completed: boolean;
}

const TodoList = () => {
  const [tasks, setTasks] = useState<ITodo[]>([]);  // State để lưu trữ danh sách công việc
  const [newTask, setNewTask] = useState<string>("");  // State để lưu trữ công việc mới được thêm vào
  const [error, setError] = useState<string>("");  // State để quản lý thông báo lỗi khi thêm công việc
  const [showModal, setShowModal] = useState<boolean>(false);  // State để điều khiển hiển thị modal xác nhận xóa
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);  // State để lưu trữ id của công việc sẽ bị xóa
  const [editTaskId, setEditTaskId] = useState<number | null>(null);  // State để lưu trữ id của công việc đang được chỉnh sửa
  const [editTaskName, setEditTaskName] = useState<string>("");  // State để lưu trữ tên công việc đang được chỉnh sửa

  // tải các phần đã lưu từ local khi render lần dầu
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  // lưu vào local mỗi khi các state thay đổi
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() === "") {
      setError("Tên công việc không được để trống");
      return;
    }
    if (tasks.some((task) => task.name === newTask.trim())) {
      setError("Tên công việc không được phép trùng");
      return;
    }
    const newTodo: ITodo = {
      id: Date.now(),
      name: newTask.trim(),
      completed: false,
    };
    setTasks([...tasks, newTodo]);
    setNewTask("");
    setError("");
  };

  const handleToggleTask = (id: number) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
    setShowModal(false);
    setTaskToDelete(null);
  };

  const handleEditTask = () => {
    if (editTaskId !== null && editTaskName.trim() !== "") {
      const updatedTasks = tasks.map((task) =>
        task.id === editTaskId ? { ...task, name: editTaskName.trim() } : task
      );
      setTasks(updatedTasks);
      setEditTaskId(null);
      setEditTaskName("");
    }
  };

  // confirm
  const handleConfirmDelete = (id: number) => {
    setTaskToDelete(id);
    setShowModal(true);
  };

  const handleOpenEdit = (id: number, name: string) => {
    setEditTaskId(id);
    setEditTaskName(name);
  };

  const completedTasksCount = tasks.filter((task) => task.completed).length;

  return (
    <div>
      <h1>Danh sách công việc</h1>
      <div className="body">
        <div className="search">
          <Row>
            <Col xs="auto">
              <Form.Control
                type="text"
                placeholder="Nhập tên công việc"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
            </Col>
            <Col xs="auto">
              <Button type="submit" onClick={handleAddTask}>
                Thêm
              </Button>
            </Col>
          </Row>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
        <Col>
          <Navbar className="bg-body-tertiary justify-content-between">
            <Form>
              <Row>
                <table className="list">
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggleTask(task.id)}
                          />
                        </td>
                        <td>
                          {editTaskId === task.id ? (
                            <Form.Control
                              type="text"
                              value={editTaskName}
                              onChange={(e) => setEditTaskName(e.target.value)}
                            />
                          ) : (
                            <span
                              style={{
                                textDecoration: task.completed
                                  ? "line-through"
                                  : "",
                              }}
                            >
                              {task.name}
                            </span>
                          )}
                        </td>
                        <td>
                          {editTaskId === task.id ? (
                            <Button variant="success" onClick={handleEditTask}>
                              Lưu
                            </Button>
                          ) : (
                            <>
                              <EditIcon
                                onClick={() =>
                                  handleOpenEdit(task.id, task.name)
                                }
                              />
                              <DeleteIcon
                                onClick={() => handleConfirmDelete(task.id)}
                              />
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Row>
            </Form>
          </Navbar>
        </Col>
        {completedTasksCount === tasks.length && tasks.length > 0 && (
          <p>Hoàn thành công việc</p>
        )}
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn xóa công việc này?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={() =>
              taskToDelete !== null && handleDeleteTask(taskToDelete)
            }
          >
            Đồng ý
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export { TodoList };
