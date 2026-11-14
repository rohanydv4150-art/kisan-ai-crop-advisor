-- =============================================================================
-- Migration: 20240101000000_init_agriculture_schema.sql
-- Description: Core schema for AI-Powered Agriculture Crop Advisory Assistant
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -----------------------------------------------------------------------------
-- 1. Farmer Profiles
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.farmer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    state TEXT,
    district TEXT,
    village TEXT,
    preferred_language TEXT NOT NULL DEFAULT 'en',
    farming_experience INTEGER,
    default_land_area NUMERIC(12, 2),
    land_unit TEXT DEFAULT 'acre',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_experience
        CHECK (farming_experience IS NULL OR farming_experience >= 0),
    CONSTRAINT valid_land_area
        CHECK (default_land_area IS NULL OR default_land_area > 0),
    CONSTRAINT valid_land_unit
        CHECK (land_unit IN ('acre', 'hectare'))
);

-- -----------------------------------------------------------------------------
-- 2. Advisory Reports
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.advisory_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    advisory_type TEXT NOT NULL,
    location JSONB NOT NULL DEFAULT '{}'::jsonb,
    input_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    ai_response JSONB,
    status TEXT NOT NULL DEFAULT 'pending',
    model_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_advisory_type CHECK (
        advisory_type IN (
            'crop',
            'soil',
            'fertilizer',
            'irrigation',
            'disease',
            'general'
        )
    ),
    CONSTRAINT valid_advisory_status CHECK (
        status IN ('pending', 'completed', 'failed')
    )
);

-- -----------------------------------------------------------------------------
-- 3. Chat Conversations
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chat_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT DEFAULT 'New Conversation',
    language TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 4. Chat Messages
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    CONSTRAINT valid_chat_role
        CHECK (role IN ('user', 'assistant'))
);

-- -----------------------------------------------------------------------------
-- 5. Weather Records
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.weather_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    location JSONB NOT NULL,
    weather_data JSONB NOT NULL,
    provider TEXT NOT NULL,
    observed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 6. Saved Crops
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_crops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    crop_name TEXT NOT NULL,
    crop_category TEXT,
    notes TEXT,
    advisory_report_id UUID REFERENCES public.advisory_reports(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 7. Notifications
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type TEXT DEFAULT 'general',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 8. Performance Indexes
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_advisory_user
    ON public.advisory_reports(user_id);

CREATE INDEX IF NOT EXISTS idx_advisory_created
    ON public.advisory_reports(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_advisory_type
    ON public.advisory_reports(advisory_type);

CREATE INDEX IF NOT EXISTS idx_chat_user
    ON public.chat_conversations(user_id);

CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation
    ON public.chat_messages(conversation_id, created_at);

CREATE INDEX IF NOT EXISTS idx_weather_user
    ON public.weather_records(user_id);

CREATE INDEX IF NOT EXISTS idx_saved_crops_user
    ON public.saved_crops(user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user
    ON public.notifications(user_id, is_read);

-- -----------------------------------------------------------------------------
-- 9. Automatic Updated-At Trigger
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_farmer_profiles_updated_at ON public.farmer_profiles;
CREATE TRIGGER trigger_farmer_profiles_updated_at
    BEFORE UPDATE ON public.farmer_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_advisory_reports_updated_at ON public.advisory_reports;
CREATE TRIGGER trigger_advisory_reports_updated_at
    BEFORE UPDATE ON public.advisory_reports
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_chat_conversations_updated_at ON public.chat_conversations;
CREATE TRIGGER trigger_chat_conversations_updated_at
    BEFORE UPDATE ON public.chat_conversations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
