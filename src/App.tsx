import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Layout } from "@/components/Layout"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { Home } from "@/pages/Home"
import { VendorDetail } from "@/pages/VendorDetail"
import { Admin } from "@/pages/Admin"
import { AdminForm } from "@/pages/AdminForm"

import { Toaster } from "sonner"

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/vendor/:id" element={<VendorDetail />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/new" element={<AdminForm />} />
            <Route path="/admin/edit/:id" element={<AdminForm />} />
          </Route>
        </Routes>
        <Toaster position="bottom-right" richColors />
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
