// src/api/aiService.js
import axios from 'axios';

const API_KEY = process.env.VUE_APP_OPENAI_API_KEY;
const BASE_URL = 'https://api.openai.com/v1/chat/completions';
const TIMEOUT = 30000; // 30秒超时

export const sendToAI = async (message, messageHistory = []) => {
  try {
    const response = await axios.post(
      BASE_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [...messageHistory, { role: "user", content: message }]
      },
      {
        headers: { Authorization: `Bearer ${API_KEY}` },
        timeout: TIMEOUT
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('请求超时，请稍后重试');
    }
    if (error.response) {
      throw new Error(`API 错误: ${error.response.data.error.message}`);
    }
    throw new Error('网络请求失败，请检查网络连接');
  }
};