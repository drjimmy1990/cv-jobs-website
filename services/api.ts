// services/api.ts

// ⬇️ IMPORTANT: Replace this with your actual n8n webhook URL
// If running n8n locally, it's usually http://localhost:5678/webhook
// If using n8n tunnel/cloud, use that URL.

// services/api.ts

// ⬇️ Make sure this URL is correct for your n8n instance
const N8N_BASE_URL = 'https://n8n.ai4eg.com/webhook';

interface ContactPayload {
    email: string;
    subject: string;
    message: string;
}

// ✅ THIS IS THE CRITICAL LINE - "export const api"
export const api = {
    /**
     * Sends contact form data to n8n
     */
    submitContact: async (data: ContactPayload) => {
        try {
            const response = await fetch(`${N8N_BASE_URL}/contact-us`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`n8n Error: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }
};