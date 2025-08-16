import { supabase } from "@/integrations/supabase/client";

interface Provider {
  id: string;
  name: string;
  specialty?: string;
  location?: string;
  phone?: string;
  email?: string;
  external_booking_url?: string | null;
}

interface SecureProvider extends Omit<Provider, 'phone' | 'email'> {
  phone?: string | null;
  email?: string | null;
}

/**
 * Checks if the current user has an appointment with a specific provider
 */
export const hasAppointmentWithProvider = async (providerId: string): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return false;

  const { data, error } = await supabase
    .from('appointments')
    .select('id')
    .eq('provider_id', providerId)
    .eq('user_id', session.user.id)
    .in('status', ['booked', 'confirmed'])
    .limit(1);

  return !error && data && data.length > 0;
};

/**
 * Masks sensitive provider contact information unless user has an appointment
 */
export const secureProviderData = async (providers: Provider[]): Promise<SecureProvider[]> => {
  const securedProviders = await Promise.all(
    providers.map(async (provider): Promise<SecureProvider> => {
      const hasAppt = await hasAppointmentWithProvider(provider.id);
      
      return {
        id: provider.id,
        name: provider.name,
        specialty: provider.specialty,
        location: provider.location,
        external_booking_url: provider.external_booking_url,
        // Only show contact details if user has appointment with this provider
        phone: hasAppt ? provider.phone : null,
        email: hasAppt ? provider.email : null,
      };
    })
  );

  return securedProviders;
};

/**
 * Masks a single provider's contact information
 */
export const secureSingleProvider = async (provider: Provider): Promise<SecureProvider> => {
  const hasAppt = await hasAppointmentWithProvider(provider.id);
  
  return {
    id: provider.id,
    name: provider.name,
    specialty: provider.specialty,
    location: provider.location,
    external_booking_url: provider.external_booking_url,
    phone: hasAppt ? provider.phone : null,
    email: hasAppt ? provider.email : null,
  };
};