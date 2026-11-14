import { getSupabaseAdmin } from '../config/supabase.js';
import { 
  FarmerProfile, 
  AdvisoryReportRecord, 
  ChatConversation, 
  ChatMessage, 
  SavedCrop, 
  NotificationRecord 
} from '../types/index.js';
import crypto from 'crypto';

// In-memory fallback store for local development before Supabase keys are configured
class MemoryStore {
  public profiles: Map<string, FarmerProfile> = new Map();
  public advisories: Map<string, AdvisoryReportRecord> = new Map();
  public conversations: Map<string, ChatConversation> = new Map();
  public messages: Map<string, ChatMessage[]> = new Map();
  public savedCrops: Map<string, SavedCrop> = new Map();
  public notifications: Map<string, NotificationRecord[]> = new Map();
}

const memoryStore = new MemoryStore();

export class DatabaseService {
  // ==========================================
  // Farmer Profile
  // ==========================================
  public static async getProfile(userId: string): Promise<FarmerProfile | null> {
    const supabase = getSupabaseAdmin();
    if (supabase) {
      const { data, error } = await supabase
        .from('farmer_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile from Supabase:', error);
        throw error;
      }
      return data;
    }

    // Fallback store
    return memoryStore.profiles.get(userId) || null;
  }

  public static async upsertProfile(
    userId: string,
    profileData: Partial<FarmerProfile>
  ): Promise<FarmerProfile> {
    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();

    if (supabase) {
      const { data, error } = await supabase
        .from('farmer_profiles')
        .upsert(
          {
            user_id: userId,
            ...profileData,
            updated_at: now,
          },
          { onConflict: 'user_id' }
        )
        .select()
        .single();

      if (error) {
        console.error('Error upserting profile in Supabase:', error);
        throw error;
      }
      return data;
    }

    // Fallback store
    const existing = memoryStore.profiles.get(userId);
    const updated: FarmerProfile = {
      id: existing?.id || crypto.randomUUID(),
      user_id: userId,
      full_name: profileData.full_name || existing?.full_name || 'Farmer',
      phone: profileData.phone ?? existing?.phone ?? null,
      state: profileData.state ?? existing?.state ?? null,
      district: profileData.district ?? existing?.district ?? null,
      village: profileData.village ?? existing?.village ?? null,
      preferred_language: profileData.preferred_language || existing?.preferred_language || 'en',
      farming_experience: profileData.farming_experience ?? existing?.farming_experience ?? null,
      default_land_area: profileData.default_land_area ?? existing?.default_land_area ?? null,
      land_unit: profileData.land_unit || existing?.land_unit || 'acre',
      created_at: existing?.created_at || now,
      updated_at: now,
    };
    memoryStore.profiles.set(userId, updated);
    return updated;
  }

  // ==========================================
  // Advisory Reports
  // ==========================================
  public static async saveAdvisoryReport(
    report: Omit<AdvisoryReportRecord, 'id' | 'created_at' | 'updated_at'>
  ): Promise<AdvisoryReportRecord> {
    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();

    if (supabase) {
      const { data, error } = await supabase
        .from('advisory_reports')
        .insert({
          ...report,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving advisory in Supabase:', error);
        throw error;
      }
      return data;
    }

    const id = crypto.randomUUID();
    const record: AdvisoryReportRecord = {
      id,
      ...report,
      created_at: now,
      updated_at: now,
    };
    memoryStore.advisories.set(id, record);
    return record;
  }

  public static async getAdvisories(
    userId: string,
    type?: string,
    search?: string
  ): Promise<AdvisoryReportRecord[]> {
    const supabase = getSupabaseAdmin();

    if (supabase) {
      let query = supabase
        .from('advisory_reports')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (type && type !== 'all') {
        query = query.eq('advisory_type', type);
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching advisories from Supabase:', error);
        throw error;
      }
      return data || [];
    }

    // Fallback store
    let records = Array.from(memoryStore.advisories.values())
      .filter((r) => r.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    if (type && type !== 'all') {
      records = records.filter((r) => r.advisory_type === type);
    }
    if (search) {
      const q = search.toLowerCase();
      records = records.filter((r) => 
        JSON.stringify(r.input_data).toLowerCase().includes(q) ||
        JSON.stringify(r.ai_response).toLowerCase().includes(q)
      );
    }
    return records;
  }

  public static async getAdvisoryById(
    id: string,
    userId: string
  ): Promise<AdvisoryReportRecord | null> {
    const supabase = getSupabaseAdmin();

    if (supabase) {
      const { data, error } = await supabase
        .from('advisory_reports')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching advisory by id:', error);
        throw error;
      }
      return data;
    }

    const record = memoryStore.advisories.get(id);
    if (!record || record.user_id !== userId) {
      return null;
    }
    return record;
  }

  public static async deleteAdvisory(id: string, userId: string): Promise<boolean> {
    const supabase = getSupabaseAdmin();

    if (supabase) {
      const { error } = await supabase
        .from('advisory_reports')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    }

    const record = memoryStore.advisories.get(id);
    if (record && record.user_id === userId) {
      memoryStore.advisories.delete(id);
      return true;
    }
    return false;
  }

  // ==========================================
  // Chat Conversations & Messages
  // ==========================================
  public static async createConversation(
    userId: string,
    title: string,
    language: 'en' | 'hi'
  ): Promise<ChatConversation> {
    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();

    if (supabase) {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: userId,
          title,
          language,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    const id = crypto.randomUUID();
    const conv: ChatConversation = {
      id,
      user_id: userId,
      title,
      language,
      created_at: now,
      updated_at: now,
    };
    memoryStore.conversations.set(id, conv);
    memoryStore.messages.set(id, []);
    return conv;
  }

  public static async getConversations(userId: string): Promise<ChatConversation[]> {
    const supabase = getSupabaseAdmin();

    if (supabase) {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }

    return Array.from(memoryStore.conversations.values())
      .filter((c) => c.user_id === userId)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }

  public static async getConversationById(
    conversationId: string,
    userId: string
  ): Promise<{ conversation: ChatConversation; messages: ChatMessage[] } | null> {
    const supabase = getSupabaseAdmin();

    if (supabase) {
      const { data: conversation, error: convError } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('user_id', userId)
        .maybeSingle();

      if (convError || !conversation) return null;

      const { data: messages, error: msgError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (msgError) throw msgError;

      return { conversation, messages: messages || [] };
    }

    const conversation = memoryStore.conversations.get(conversationId);
    if (!conversation || conversation.user_id !== userId) return null;

    const messages = memoryStore.messages.get(conversationId) || [];
    return { conversation, messages };
  }

  public static async saveChatMessage(
    message: Omit<ChatMessage, 'id' | 'created_at'>
  ): Promise<ChatMessage> {
    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();

    if (supabase) {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          ...message,
          created_at: now,
        })
        .select()
        .single();

      if (error) throw error;

      // Update conversation updated_at
      await supabase
        .from('chat_conversations')
        .update({ updated_at: now })
        .eq('id', message.conversation_id);

      return data;
    }

    const id = crypto.randomUUID();
    const msg: ChatMessage = {
      id,
      ...message,
      created_at: now,
    };
    const list = memoryStore.messages.get(message.conversation_id) || [];
    list.push(msg);
    memoryStore.messages.set(message.conversation_id, list);

    const conv = memoryStore.conversations.get(message.conversation_id);
    if (conv) {
      conv.updated_at = now;
    }

    return msg;
  }

  public static async deleteConversation(id: string, userId: string): Promise<boolean> {
    const supabase = getSupabaseAdmin();

    if (supabase) {
      const { error } = await supabase
        .from('chat_conversations')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    }

    const conv = memoryStore.conversations.get(id);
    if (conv && conv.user_id === userId) {
      memoryStore.conversations.delete(id);
      memoryStore.messages.delete(id);
      return true;
    }
    return false;
  }

  // ==========================================
  // Saved Crops
  // ==========================================
  public static async saveCrop(
    userId: string,
    cropName: string,
    category?: string | null,
    notes?: string | null,
    advisoryReportId?: string | null
  ): Promise<SavedCrop> {
    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();

    if (supabase) {
      const { data, error } = await supabase
        .from('saved_crops')
        .insert({
          user_id: userId,
          crop_name: cropName,
          crop_category: category,
          notes,
          advisory_report_id: advisoryReportId,
          created_at: now,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    const id = crypto.randomUUID();
    const record: SavedCrop = {
      id,
      user_id: userId,
      crop_name: cropName,
      crop_category: category,
      notes,
      advisory_report_id: advisoryReportId,
      created_at: now,
    };
    memoryStore.savedCrops.set(id, record);
    return record;
  }

  public static async getSavedCrops(userId: string): Promise<SavedCrop[]> {
    const supabase = getSupabaseAdmin();

    if (supabase) {
      const { data, error } = await supabase
        .from('saved_crops')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }

    return Array.from(memoryStore.savedCrops.values())
      .filter((c) => c.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public static async deleteSavedCrop(id: string, userId: string): Promise<boolean> {
    const supabase = getSupabaseAdmin();

    if (supabase) {
      const { error } = await supabase
        .from('saved_crops')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    }

    const record = memoryStore.savedCrops.get(id);
    if (record && record.user_id === userId) {
      memoryStore.savedCrops.delete(id);
      return true;
    }
    return false;
  }

  // ==========================================
  // Notifications
  // ==========================================
  public static async getNotifications(userId: string): Promise<NotificationRecord[]> {
    const supabase = getSupabaseAdmin();

    if (supabase) {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    }

    const list = memoryStore.notifications.get(userId) || [];
    return [...list].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  public static async markNotificationRead(id: string, userId: string): Promise<boolean> {
    const supabase = getSupabaseAdmin();

    if (supabase) {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    }

    const list = memoryStore.notifications.get(userId) || [];
    const item = list.find((n) => n.id === id);
    if (item) {
      item.is_read = true;
      return true;
    }
    return false;
  }

  public static async addNotification(
    userId: string,
    title: string,
    message: string,
    type: string = 'general'
  ): Promise<NotificationRecord> {
    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();

    if (supabase) {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title,
          message,
          notification_type: type,
          is_read: false,
          created_at: now,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    const id = crypto.randomUUID();
    const record: NotificationRecord = {
      id,
      user_id: userId,
      title,
      message,
      notification_type: type,
      is_read: false,
      created_at: now,
    };
    const list = memoryStore.notifications.get(userId) || [];
    list.unshift(record);
    memoryStore.notifications.set(userId, list);
    return record;
  }
}
