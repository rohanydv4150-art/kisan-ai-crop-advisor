-- =============================================================================
-- Seed Data: supabase/seed.sql
-- Description: Development reference data and helper functions
-- =============================================================================

-- Notes:
-- In Supabase, users are created through auth.users via Supabase Auth signup.
-- This script contains helper functions and reference sample notification seeds.

-- Sample system notification template function
CREATE OR REPLACE FUNCTION public.create_welcome_notification(p_user_id UUID, p_farmer_name TEXT)
RETURNS void AS $$
BEGIN
    INSERT INTO public.notifications (user_id, title, message, notification_type)
    VALUES (
        p_user_id,
        'Welcome to Agriculture Advisor',
        'Welcome ' || p_farmer_name || '! Your AI-powered crop advisory system is ready. Start by running your first crop advisory.',
        'welcome'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
