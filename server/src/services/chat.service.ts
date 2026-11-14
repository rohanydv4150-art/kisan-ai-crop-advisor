import { z } from 'zod';
import { chatMessageInputSchema, chatbotResponseSchema } from '../schemas/index.js';
import { GeminiService } from './gemini.service.js';
import { DatabaseService } from './database.service.js';
import { buildChatbotPrompt } from '../prompts/chatbot.prompt.js';
import { ChatMessage, ChatConversation } from '../types/index.js';

export class ChatService {
  /**
   * Processes a user question, queries Gemini, and stores both messages in conversation history.
   */
  public static async processMessage(
    userId: string,
    input: z.infer<typeof chatMessageInputSchema>
  ): Promise<{
    conversation: ChatConversation;
    userMessage: ChatMessage;
    assistantMessage: ChatMessage;
    aiResponse: z.infer<typeof chatbotResponseSchema>;
  }> {
    let conversationId = input.conversation_id;
    let conversation: ChatConversation;

    // 1. Get or create conversation
    if (conversationId) {
      const data = await DatabaseService.getConversationById(conversationId, userId);
      if (!data) {
        throw new Error('Conversation not found or access denied');
      }
      conversation = data.conversation;
    } else {
      // Auto-title conversation with the first 40 characters of question
      const title = input.content.slice(0, 40) + (input.content.length > 40 ? '...' : '');
      conversation = await DatabaseService.createConversation(userId, title, input.language);
      conversationId = conversation.id;
    }

    // 2. Fetch recent conversation history for multi-turn context
    const convData = await DatabaseService.getConversationById(conversationId, userId);
    const existingMessages = convData?.messages || [];
    const historySummary = existingMessages.slice(-6).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // 3. Save User message first
    const userMsg = await DatabaseService.saveChatMessage({
      conversation_id: conversationId,
      user_id: userId,
      role: 'user',
      content: input.content,
      category: null,
    });

    // 4. Generate AI response with Gemini
    const prompt = buildChatbotPrompt(input, historySummary);
    const aiResult = await GeminiService.generateStructuredResponse(
      prompt,
      chatbotResponseSchema
    );

    // 5. Save Assistant message
    const assistantMsg = await DatabaseService.saveChatMessage({
      conversation_id: conversationId,
      user_id: userId,
      role: 'assistant',
      content: aiResult.message,
      category: aiResult.category,
    });

    return {
      conversation,
      userMessage: userMsg,
      assistantMessage: assistantMsg,
      aiResponse: aiResult,
    };
  }
}
