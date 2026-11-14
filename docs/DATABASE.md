# Supabase PostgreSQL Database Architecture

## 1. Entity Relationship Model

The database is built on PostgreSQL with Row Level Security (RLS) on Supabase.

```
auth.users (Supabase Managed)
    │
    ├── 1:1 ── public.farmer_profiles
    │
    ├── 1:N ── public.advisory_reports
    │              │
    │              └── 1:N ── public.saved_crops (advisory_report_id)
    │
    ├── 1:N ── public.chat_conversations
    │              │
    │              └── 1:N ── public.chat_messages (conversation_id)
    │
    ├── 1:N ── public.weather_records
    │
    ├── 1:N ── public.saved_crops
    │
    └── 1:N ── public.notifications
```

---

## 2. Table Specifications

### `public.farmer_profiles`
Maintains farmer demographics, geographic base, and farm measurements.
- `id` (UUID, Primary Key)
- `user_id` (UUID, Unique, Foreign Key -> `auth.users(id) ON DELETE CASCADE`)
- `full_name` (TEXT, NOT NULL)
- `phone` (TEXT, Nullable)
- `state` (TEXT)
- `district` (TEXT)
- `village` (TEXT)
- `preferred_language` (TEXT, Default 'en')
- `farming_experience` (INTEGER, CHECK >= 0)
- `default_land_area` (NUMERIC(12,2), CHECK > 0)
- `land_unit` (TEXT, CHECK IN ('acre', 'hectare'))
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### `public.advisory_reports`
Stores immutable generated AI agricultural advisories.
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key -> `auth.users(id) ON DELETE CASCADE`)
- `advisory_type` (TEXT, CHECK IN ('crop', 'soil', 'fertilizer', 'irrigation', 'disease', 'general'))
- `location` (JSONB)
- `input_data` (JSONB)
- `ai_response` (JSONB)
- `status` (TEXT, CHECK IN ('pending', 'completed', 'failed'))
- `model_name` (TEXT)
- `created_at`, `updated_at` (TIMESTAMPTZ)

### `public.chat_conversations` & `chat_messages`
Multi-turn conversational memory for the AI agricultural assistant.
- Conversations track `title`, `language`, and timestamps.
- Messages track `role` ('user' | 'assistant'), `content`, `category`, and `conversation_id`.

### `public.saved_crops`
Shortlisted crops bookmarked by farmers from advisory reports.

### `public.notifications`
System announcements and advisory completion notifications.

---

## 3. Row Level Security (RLS) Policies

Every table has RLS enabled. Policies ensure that farmers can strictly access and mutate only their own data:

```sql
-- Example for advisory_reports
CREATE POLICY "Users manage own advisories"
ON public.advisory_reports
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

For conversation messages, cross-table verification is enforced:
```sql
CREATE POLICY "Users manage own messages"
ON public.chat_messages
FOR ALL
TO authenticated
USING (
    auth.uid() = user_id
    AND EXISTS (
        SELECT 1
        FROM public.chat_conversations c
        WHERE c.id = conversation_id
        AND c.user_id = auth.uid()
    )
);
```

---

## 4. Performance Indexes
- `idx_advisory_user` on `advisory_reports(user_id)`
- `idx_advisory_created` on `advisory_reports(created_at DESC)`
- `idx_advisory_type` on `advisory_reports(advisory_type)`
- `idx_chat_user` on `chat_conversations(user_id)`
- `idx_chat_messages_conversation` on `chat_messages(conversation_id, created_at)`
