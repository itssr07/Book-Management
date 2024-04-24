import { Route, Routes } from "react-router-dom";
import { AddBookPage, BookPage } from "./pages/index";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<BookPage />} />
        <Route path="/add-book" element={<AddBookPage />} />
      </Routes>
    </>
  );
}

export default App;
