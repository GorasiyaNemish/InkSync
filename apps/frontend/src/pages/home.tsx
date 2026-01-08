import { useNavigate } from "react-router";

const HomePage = () => {
  const navigate = useNavigate();
  const navigateToBoard = () => {
    navigate(`/board/${crypto.randomUUID()}`);
  };
  return (
    <div>
      <h1>Your whiteboard</h1>
      <button onClick={navigateToBoard}>Create a whiteboard</button>
    </div>
  );
};

export default HomePage;
