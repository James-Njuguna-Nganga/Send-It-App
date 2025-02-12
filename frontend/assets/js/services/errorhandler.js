export const handleError = (error) => {
    console.error('API Error:', error);
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        return 'Network error. Please check your connection.';
    }
    return error.message || 'An unexpected error occurred';

};