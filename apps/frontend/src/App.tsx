import { useEffect, useState } from "react";
import "./App.css";
import { Navigate, Route, Routes } from "react-router";
import WhiteboardPage from "./pages/whiteboard";
import HomePage from "./pages/home";

function App() {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/api/hello")
      .then((res) => res.json())
      .then((data) => setMsg(data.message));
  }, []);

  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="board">
        <Route
          index
          element={<Navigate to={`/board/${crypto.randomUUID()}`} />}
        />
        <Route path=":boardId" element={<WhiteboardPage />} />
      </Route>
    </Routes>
  );
}

export default App;
