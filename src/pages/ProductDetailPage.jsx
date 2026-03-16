import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetailPage = () => {
    const { id } = useParams();

    return (
        <div className="container section">
            <h1>Product Detail Page</h1>
            <p>Product ID: {id}</p>
            <p>Detailed product view coming soon...</p>
        </div>
    );
};

export default ProductDetailPage;
