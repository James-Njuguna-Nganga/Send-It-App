class EmailService {
    static async sendNotification(email, { subject, message }) {
        try {
            const response = await fetch('http://localhost:5500/api/notifications/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ email, subject, message })
            });

            if (!response.ok) {
                throw new Error('Failed to send email notification');
            }

            return await response.json();
        } catch (error) {
            console.error('Email notification error:', error);
            throw error;
        }
    }
}

export default EmailService;