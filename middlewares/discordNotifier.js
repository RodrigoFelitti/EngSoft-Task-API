import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

export const notifyDiscord = async (message, webhookUrl = DEFAULT_WEBHOOK_URL) => {
    if (!webhookUrl) return;

    try {
        await axios.post(webhookUrl, {
            content: message
        });
    } catch (err) {
        console.error('Erro ao enviar webhook para o Discord:', err.message);
    }
};
