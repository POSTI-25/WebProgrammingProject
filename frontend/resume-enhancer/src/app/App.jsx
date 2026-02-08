import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import FileUpload from "./file-upload";
import Features from "./features";
import Header from "./header";

export default function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<FileUpload />} />
        <Route path="/features" element={<Features />} />
      </Routes>
    </Router>
  );
}
