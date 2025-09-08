export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          coordinates: unknown | null
          created_at: string | null
          description: string
          expires_at: string | null
          id: string
          location: string
          severity: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          coordinates?: unknown | null
          created_at?: string | null
          description: string
          expires_at?: string | null
          id?: string
          location: string
          severity: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          coordinates?: unknown | null
          created_at?: string | null
          description?: string
          expires_at?: string | null
          id?: string
          location?: string
          severity?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          created_at: string
          ends_at: string
          id: string
          notes: string | null
          profile_snapshot: Json | null
          provider_id: string
          slot_id: string | null
          starts_at: string
          status: Database["public"]["Enums"]["appointment_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          ends_at: string
          id?: string
          notes?: string | null
          profile_snapshot?: Json | null
          provider_id: string
          slot_id?: string | null
          starts_at: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          ends_at?: string
          id?: string
          notes?: string | null
          profile_snapshot?: Json | null
          provider_id?: string
          slot_id?: string | null
          starts_at?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: false
            referencedRelation: "availability_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      availability_slots: {
        Row: {
          created_at: string
          ends_at: string
          id: string
          is_booked: boolean
          location: string | null
          provider_id: string
          starts_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          ends_at: string
          id?: string
          is_booked?: boolean
          location?: string | null
          provider_id: string
          starts_at: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          ends_at?: string
          id?: string
          is_booked?: boolean
          location?: string | null
          provider_id?: string
          starts_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_slots_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          channels: Database["public"]["Enums"]["notification_channel"][] | null
          created_at: string
          enabled: boolean | null
          id: string
          notification_type: Database["public"]["Enums"]["notification_type"]
          quiet_hours_end: string | null
          quiet_hours_start: string | null
          reminder_timing: number[] | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          channels?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          created_at?: string
          enabled?: boolean | null
          id?: string
          notification_type: Database["public"]["Enums"]["notification_type"]
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          reminder_timing?: number[] | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          channels?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          created_at?: string
          enabled?: boolean | null
          id?: string
          notification_type?: Database["public"]["Enums"]["notification_type"]
          quiet_hours_end?: string | null
          quiet_hours_start?: string | null
          reminder_timing?: number[] | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notification_templates: {
        Row: {
          care_stage: Database["public"]["Enums"]["care_stage"] | null
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at: string
          id: string
          is_active: boolean | null
          message_template: string
          title_template: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at: string
          variables: Json | null
        }
        Insert: {
          care_stage?: Database["public"]["Enums"]["care_stage"] | null
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          id?: string
          is_active?: boolean | null
          message_template: string
          title_template: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          care_stage?: Database["public"]["Enums"]["care_stage"] | null
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          id?: string
          is_active?: boolean | null
          message_template?: string
          title_template?: string
          type?: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
          variables?: Json | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          care_stage: Database["public"]["Enums"]["care_stage"] | null
          channel: Database["public"]["Enums"]["notification_channel"]
          created_at: string
          id: string
          message: string
          metadata: Json | null
          priority: number | null
          read_at: string | null
          related_appointment_id: string | null
          scheduled_for: string | null
          sent_at: string | null
          status: Database["public"]["Enums"]["delivery_status"]
          template_id: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          care_stage?: Database["public"]["Enums"]["care_stage"] | null
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          priority?: number | null
          read_at?: string | null
          related_appointment_id?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["delivery_status"]
          template_id?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          care_stage?: Database["public"]["Enums"]["care_stage"] | null
          channel?: Database["public"]["Enums"]["notification_channel"]
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          priority?: number | null
          read_at?: string | null
          related_appointment_id?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["delivery_status"]
          template_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      patient_journey_stages: {
        Row: {
          created_at: string
          current_stage: Database["public"]["Enums"]["care_stage"]
          id: string
          metadata: Json | null
          stage_started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_stage?: Database["public"]["Enums"]["care_stage"]
          id?: string
          metadata?: Json | null
          stage_started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_stage?: Database["public"]["Enums"]["care_stage"]
          id?: string
          metadata?: Json | null
          stage_started_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      post_treatment_surveys: {
        Row: {
          audio_engagement: number | null
          caregiver_support: boolean | null
          chemo_cycles: number | null
          comorbidities: string[] | null
          created_at: string | null
          distance_to_clinic: number | null
          energy_level: number | null
          mood_score: number | null
          pain_level: number | null
          patient_id: string | null
          reminders_read_rate: number | null
          side_effect_severity: Json | null
          submitted_at: string | null
          surgery_recovery_status: string | null
          survey_id: string
          text_engagement: number | null
          transportation_access: boolean | null
          treatment_stage: string | null
          updated_at: string | null
          video_engagement: number | null
          work_schedule_conflict: boolean | null
        }
        Insert: {
          audio_engagement?: number | null
          caregiver_support?: boolean | null
          chemo_cycles?: number | null
          comorbidities?: string[] | null
          created_at?: string | null
          distance_to_clinic?: number | null
          energy_level?: number | null
          mood_score?: number | null
          pain_level?: number | null
          patient_id?: string | null
          reminders_read_rate?: number | null
          side_effect_severity?: Json | null
          submitted_at?: string | null
          surgery_recovery_status?: string | null
          survey_id?: string
          text_engagement?: number | null
          transportation_access?: boolean | null
          treatment_stage?: string | null
          updated_at?: string | null
          video_engagement?: number | null
          work_schedule_conflict?: boolean | null
        }
        Update: {
          audio_engagement?: number | null
          caregiver_support?: boolean | null
          chemo_cycles?: number | null
          comorbidities?: string[] | null
          created_at?: string | null
          distance_to_clinic?: number | null
          energy_level?: number | null
          mood_score?: number | null
          pain_level?: number | null
          patient_id?: string | null
          reminders_read_rate?: number | null
          side_effect_severity?: Json | null
          submitted_at?: string | null
          surgery_recovery_status?: string | null
          survey_id?: string
          text_engagement?: number | null
          transportation_access?: boolean | null
          treatment_stage?: string | null
          updated_at?: string | null
          video_engagement?: number | null
          work_schedule_conflict?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          allergies: string | null
          avatar_url: string | null
          blood_type: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          medications: string | null
          phone: string | null
          preferred_language: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          address?: string | null
          allergies?: string | null
          avatar_url?: string | null
          blood_type?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          first_name?: string | null
          full_name?: string | null
          id: string
          last_name?: string | null
          medications?: string | null
          phone?: string | null
          preferred_language?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          address?: string | null
          allergies?: string | null
          avatar_url?: string | null
          blood_type?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          medications?: string | null
          phone?: string | null
          preferred_language?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      providers: {
        Row: {
          bio: string | null
          created_at: string
          email: string | null
          external_booking_url: string | null
          id: string
          is_active: boolean
          location: string | null
          name: string
          phone: string | null
          photo_url: string | null
          specialty: string
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email?: string | null
          external_booking_url?: string | null
          id?: string
          is_active?: boolean
          location?: string | null
          name: string
          phone?: string | null
          photo_url?: string | null
          specialty?: string
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string | null
          external_booking_url?: string | null
          id?: string
          is_active?: boolean
          location?: string | null
          name?: string
          phone?: string | null
          photo_url?: string | null
          specialty?: string
          updated_at?: string
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          action: string | null
          confidence_score: number | null
          generated_at: string | null
          model_version: string | null
          rationale: string | null
          recommendation_id: string
          survey_id: string | null
        }
        Insert: {
          action?: string | null
          confidence_score?: number | null
          generated_at?: string | null
          model_version?: string | null
          rationale?: string | null
          recommendation_id?: string
          survey_id?: string | null
        }
        Update: {
          action?: string | null
          confidence_score?: number | null
          generated_at?: string | null
          model_version?: string | null
          rationale?: string | null
          recommendation_id?: string
          survey_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "post_treatment_surveys"
            referencedColumns: ["survey_id"]
          },
        ]
      }
      risk_assessment_access: {
        Row: {
          assessment_id: string
          created_at: string
          granted_to: string
          id: string
          permission: string
        }
        Insert: {
          assessment_id: string
          created_at?: string
          granted_to: string
          id?: string
          permission?: string
        }
        Update: {
          assessment_id?: string
          created_at?: string
          granted_to?: string
          id?: string
          permission?: string
        }
        Relationships: [
          {
            foreignKeyName: "risk_assessment_access_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "risk_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      risk_assessments: {
        Row: {
          ai_assessment: string | null
          created_at: string
          id: string
          latitude: number
          location: string
          longitude: number
          risk_level: string
          user_id: string
        }
        Insert: {
          ai_assessment?: string | null
          created_at?: string
          id?: string
          latitude: number
          location: string
          longitude: number
          risk_level: string
          user_id: string
        }
        Update: {
          ai_assessment?: string | null
          created_at?: string
          id?: string
          latitude?: number
          location?: string
          longitude?: number
          risk_level?: string
          user_id?: string
        }
        Relationships: []
      }
      symptoms: {
        Row: {
          created_at: string
          date: string
          duration: string | null
          id: string
          notes: string | null
          severity: number
          symptom: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          duration?: string | null
          id?: string
          notes?: string | null
          severity: number
          symptom: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          duration?: string | null
          id?: string
          notes?: string | null
          severity?: number
          symptom?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_locations: {
        Row: {
          created_at: string
          id: string
          latitude: number
          location: string
          longitude: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          latitude: number
          location: string
          longitude: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          latitude?: number
          location?: string
          longitude?: number
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          image: string | null
          name: string | null
          token_identifier: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          image?: string | null
          name?: string | null
          token_identifier: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          image?: string | null
          name?: string | null
          token_identifier?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_view_assessment: {
        Args: { assess_id: string }
        Returns: boolean
      }
      get_notification_template: {
        Args: {
          template_care_stage?: Database["public"]["Enums"]["care_stage"]
          template_channel?: Database["public"]["Enums"]["notification_channel"]
          template_type: Database["public"]["Enums"]["notification_type"]
        }
        Returns: {
          message_template: string
          title_template: string
          variables: Json
        }[]
      }
      has_appointment_with_provider: {
        Args: { provider_uuid: string }
        Returns: boolean
      }
      is_assessment_owner: {
        Args: { assess_id: string }
        Returns: boolean
      }
    }
    Enums: {
      appointment_status: "booked" | "confirmed" | "canceled" | "completed"
      care_stage:
        | "screening"
        | "post_screening"
        | "diagnosis"
        | "treatment_planning"
        | "chemotherapy"
        | "surgery"
        | "radiation"
        | "follow_up"
        | "survivorship"
      delivery_status: "pending" | "sent" | "delivered" | "failed" | "read"
      notification_channel: "in_app" | "email" | "push" | "sms"
      notification_type:
        | "appointment_reminder"
        | "appointment_confirmation"
        | "appointment_follow_up"
        | "screening_results"
        | "diagnosis_available"
        | "treatment_reminder"
        | "pre_treatment"
        | "post_treatment"
        | "side_effect_check"
        | "wellness_tip"
        | "support_group"
        | "mental_health_check"
        | "educational_content"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      appointment_status: ["booked", "confirmed", "canceled", "completed"],
      care_stage: [
        "screening",
        "post_screening",
        "diagnosis",
        "treatment_planning",
        "chemotherapy",
        "surgery",
        "radiation",
        "follow_up",
        "survivorship",
      ],
      delivery_status: ["pending", "sent", "delivered", "failed", "read"],
      notification_channel: ["in_app", "email", "push", "sms"],
      notification_type: [
        "appointment_reminder",
        "appointment_confirmation",
        "appointment_follow_up",
        "screening_results",
        "diagnosis_available",
        "treatment_reminder",
        "pre_treatment",
        "post_treatment",
        "side_effect_check",
        "wellness_tip",
        "support_group",
        "mental_health_check",
        "educational_content",
      ],
    },
  },
} as const
