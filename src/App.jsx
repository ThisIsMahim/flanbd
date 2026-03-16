import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useLenis } from './hooks/useLenis';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';

// Layout
import Layout from './components/layout/Layout';

function App() {
    // Initialize Lenis smooth scrolling
    useLenis();

    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />

                    {/* Add more routes as needed */}
                    <Route path="*" element={<div className="container section"><h1>404 - Page Not Found</h1></div>} />
                </Routes>
            </Layout>

            {/* Toast notifications */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: 'var(--bg-card)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--glass-border)',
                    },
                    success: {
                        iconTheme: {
                            primary: 'var(--primary)',
                            secondary: 'var(--text-primary)',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#EF4444',
                            secondary: 'var(--text-primary)',
                        },
                    },
                }}
            />
        </Router>
    );
}

export default App;
