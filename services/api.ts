import { ComparisonResult } from '../types'; // Import the new type

// ✅ Update this to your real n8n domain
const N8N_BASE_URL = 'https://n8n.ai4eg.com/webhook';

interface ContactPayload {
    email: string;
    subject: string;
    message: string;
}

interface ConsultationPayload {
    userId: string;
    email: string;
    subject: string;
    message: string;
}

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
    },

    /**
     * Sends a consultation request to n8n
     */
    requestConsultation: async (data: ConsultationPayload) => {
        try {
            const response = await fetch(`${N8N_BASE_URL}/consultation-request`, {
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
    },

    /**
     * Sends two business URLs to n8n for AI analysis
     * ✅ NOW TYPED CORRECTLY
     */
    compareBusinesses: async (linkA: string, linkB: string): Promise<ComparisonResult> => {
        try {
            const response = await fetch(`${N8N_BASE_URL}/competitor-analysis`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ linkA, linkB }),
            });

            if (!response.ok) {
                throw new Error(`n8n Error: ${response.statusText}`);
            }

            // We cast the response to ComparisonResult so TypeScript knows what to expect
            return await response.json() as ComparisonResult;
        } catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }
};