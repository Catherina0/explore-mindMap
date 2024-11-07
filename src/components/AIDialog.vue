<!-- src/components/AIDialog.vue -->
<template>
  <div class="ai-dialog">
    <div class="chat-container">
      <div class="messages" ref="messagesContainer">
        <div v-for="(msg, index) in messages" 
             :key="index" 
             :class="['message', msg.role.toLowerCase()]">
          <div class="message-content">
            <strong>{{ msg.role === 'user' ? '你' : 'AI' }}:</strong>
            {{ msg.content }}
          </div>
        </div>
      </div>
    </div>
    
    <div class="input-container">
      <textarea 
        v-model="userMessage" 
        placeholder="输入问题与 AI 对话" 
        @keyup.ctrl.enter="handleSendMessage"
        :disabled="isLoading"
      />
      <button 
        @click="handleSendMessage" 
        :disabled="!userMessage.trim() || isLoading"
      >
        {{ isLoading ? '发送中...' : '发送' }}
      </button>
    </div>
  </div>
</template>

<script>
import { sendToAI } from "@/api/aiService";

export default {
  data() {
    return {
      userMessage: "",
      messages: [],
      isLoading: false,
    };
  },
  
  methods: {
    async handleSendMessage() {
      if (!this.userMessage.trim() || this.isLoading) return;
      
      try {
        this.isLoading = true;
        const userMsg = this.userMessage;
        
        // 添加用户消息
        this.messages.push({ role: "user", content: userMsg });
        this.userMessage = ""; // 清空输入框
        
        // 获取AI响应
        const aiResponse = await sendToAI(userMsg, this.messages);
        
        // 添加AI响应
        this.messages.push({ role: "AI", content: aiResponse });
        
        // 触发事件，将 AI 响应发送至主组件
        this.$emit("add-node", aiResponse);
        
        // 滚动到底部
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      } catch (error) {
        // 显示错误消息
        this.messages.push({ 
          role: "system", 
          content: `错误: ${error.message}` 
        });
      } finally {
        this.isLoading = false;
      }
    },
    
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      container.scrollTop = container.scrollHeight;
    }
  }
};
</script>

<style scoped>
.ai-dialog {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 600px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  padding: 10px;
  border-radius: 8px;
  max-width: 80%;
}

.message.user {
  align-self: flex-end;
  background-color: #e3f2fd;
}

.message.ai {
  align-self: flex-start;
  background-color: #f5f5f5;
}

.message.system {
  align-self: center;
  background-color: #ffebee;
  color: #c62828;
}

.input-container {
  display: flex;
  gap: 10px;
  padding: 15px;
  border-top: 1px solid #ddd;
}

textarea {
  flex: 1;
  min-height: 60px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

button {
  padding: 0 20px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>