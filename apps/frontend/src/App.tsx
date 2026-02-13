import "./App.css";
import { Navigate, Route, Routes } from "react-router";
import WhiteboardPage from "./pages/whiteboard";
import HomePage from "./pages/home";
import BoardNotFoundPage from "./pages/BoardNotFound";

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="board">
        <Route
          index
          element={<Navigate to="/" replace />}
        />
        <Route path=":boardId" element={<WhiteboardPage />} />
      </Route>
      <Route path="board-not-found" element={<BoardNotFoundPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
