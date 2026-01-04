import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Explorer from "./pages/Explorer";
import Analytics from "./pages/Analytics"

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/block/:id" element={<Explorer />} />
        <Route path="/tx/:id" element={<Explorer />} />
        <Route path="/analytics" element={<Analytics />} />
      </Route>
    </Routes>
  );
}
