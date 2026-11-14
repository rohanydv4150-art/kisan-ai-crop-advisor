-- =============================================================================
-- Migration: 20240101000001_rls_policies.sql
-- Description: Row Level Security (RLS) policies for user data isolation
-- =============================================================================

-- Enable Row Level Security on all user-owned tables
ALTER TABLE public.farmer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisory_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 1. Farmer Profiles RLS
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users manage own profile" ON public.farmer_profiles;
CREATE POLICY "Users manage own profile"
ON public.farmer_profiles
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 2. Advisory Reports RLS
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users manage own advisories" ON public.advisory_reports;
CREATE POLICY "Users manage own advisories"
ON public.advisory_reports
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 3. Chat Conversations RLS
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users manage own conversations" ON public.chat_conversations;
CREATE POLICY "Users manage own conversations"
ON public.chat_conversations
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 4. Chat Messages RLS
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users manage own messages" ON public.chat_messages;
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
)
WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
        SELECT 1
        FROM public.chat_conversations c
        WHERE c.id = conversation_id
        AND c.user_id = auth.uid()
    )
);

-- -----------------------------------------------------------------------------
-- 5. Weather Records RLS
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users manage own weather records" ON public.weather_records;
CREATE POLICY "Users manage own weather records"
ON public.weather_records
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 6. Saved Crops RLS
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users manage own saved crops" ON public.saved_crops;
CREATE POLICY "Users manage own saved crops"
ON public.saved_crops
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 7. Notifications RLS
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users manage own notifications" ON public.notifications;
CREATE POLICY "Users manage own notifications"
ON public.notifications
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
