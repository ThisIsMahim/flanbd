brand: {
    name: {
        type: String,
        required: true
    },
    logo: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        }
    }
},
categories: [{
    type: String,
    required: [true, "Please enter at least one product category"]
}],
stock: {
// ... existing code ...
} 