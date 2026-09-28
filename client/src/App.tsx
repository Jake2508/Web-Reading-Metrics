import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Sidebar } from "./components/layout/Sidebar";
import { Dashboard } from "./features/dashboard/Dashboard";
import { BookList } from "./features/books/BookList";
import { AdminPanel } from "./features/admin/AdminPanel";
import { CoverPreloader } from "./features/books/CoverPreloader";

const IS_STATIC = import.meta.env.VITE_STATIC_MODE === "true";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CoverPreloader />
      <BrowserRouter>
        <div className="min-h-screen md:grid md:grid-cols-[240px_minmax(0,1fr)]">
          <Sidebar />
          <main className="min-w-0 px-4 pt-6 pb-9 sm:px-8 md:pt-7">
            <div className="mx-auto max-w-[1320px]">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/books" element={<BookList />} />
                <Route
                  path="/admin"
                  element={IS_STATIC ? <Navigate to="/" replace /> : <AdminPanel />}
                />
              </Routes>
            </div>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
