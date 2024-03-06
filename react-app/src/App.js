import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./Components/LoginPage";
import HodPage from "./Components/HodPage";
import PrincipalPage from "./Components/PrincipalPage";
import FacultyPage from "./Components/FacultyPage";
import StudentPage from "./Components/StudentPage";

function App() {
  return (
    <Router>
      <div className="App">
        <section className="login-section">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/hod" element={<HodPage />} />
            <Route path="/principal" element={<PrincipalPage />} />
            <Route path="/faculty" element={<FacultyPage />} />
            <Route path="/student" element={<StudentPage />} />
          </Routes>
        </section>
      </div>
    </Router>
  );
}

export default App;
