export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_suggestions: {
        Row: {
          confidence: number | null
          created_at: string | null
          description: string
          id: string
          is_applied: boolean | null
          project_id: string
          suggestion_type: string
          title: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          description: string
          id?: string
          is_applied?: boolean | null
          project_id: string
          suggestion_type: string
          title: string
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          description?: string
          id?: string
          is_applied?: boolean | null
          project_id?: string
          suggestion_type?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_suggestions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      campus_zones: {
        Row: {
          boundary_coordinates: Json
          created_at: string
          delivery_fee: number | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          boundary_coordinates: Json
          created_at?: string
          delivery_fee?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          boundary_coordinates?: Json
          created_at?: string
          delivery_fee?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          message_type: string
          response: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          message_type?: string
          response: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          message_type?: string
          response?: string
          user_id?: string
        }
        Relationships: []
      }
      climate_alerts: {
        Row: {
          alert_message: string
          alert_type: string
          created_at: string
          end_date: string | null
          id: string
          is_active: boolean
          location_name: string
          severity: string
          start_date: string
        }
        Insert: {
          alert_message: string
          alert_type: string
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          location_name: string
          severity?: string
          start_date: string
        }
        Update: {
          alert_message?: string
          alert_type?: string
          created_at?: string
          end_date?: string | null
          id?: string
          is_active?: boolean
          location_name?: string
          severity?: string
          start_date?: string
        }
        Relationships: []
      }
      climate_data: {
        Row: {
          created_at: string
          data_source: string
          date_recorded: string
          heat_index: number
          humidity_percent: number
          id: string
          latitude: number
          location_name: string
          longitude: number
          rainfall_mm: number
          risk_level: string
          temperature_celsius: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_source?: string
          date_recorded: string
          heat_index?: number
          humidity_percent?: number
          id?: string
          latitude: number
          location_name: string
          longitude: number
          rainfall_mm?: number
          risk_level?: string
          temperature_celsius?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_source?: string
          date_recorded?: string
          heat_index?: number
          humidity_percent?: number
          id?: string
          latitude?: number
          location_name?: string
          longitude?: number
          rainfall_mm?: number
          risk_level?: string
          temperature_celsius?: number
          updated_at?: string
        }
        Relationships: []
      }
      components: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          properties: Json | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          properties?: Json | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          properties?: Json | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      deliveries: {
        Row: {
          created_at: string
          dropoff_latitude: number | null
          dropoff_location: string
          dropoff_longitude: number | null
          estimated_delivery_time: string | null
          id: string
          package_size: string
          pickup_latitude: number | null
          pickup_location: string
          pickup_longitude: number | null
          price: number
          rider_id: string | null
          special_instructions: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dropoff_latitude?: number | null
          dropoff_location: string
          dropoff_longitude?: number | null
          estimated_delivery_time?: string | null
          id?: string
          package_size: string
          pickup_latitude?: number | null
          pickup_location: string
          pickup_longitude?: number | null
          price: number
          rider_id?: string | null
          special_instructions?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dropoff_latitude?: number | null
          dropoff_location?: string
          dropoff_longitude?: number | null
          estimated_delivery_time?: string | null
          id?: string
          package_size?: string
          pickup_latitude?: number | null
          pickup_location?: string
          pickup_longitude?: number | null
          price?: number
          rider_id?: string | null
          special_instructions?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      forum_comments: {
        Row: {
          attachments: Json | null
          content: string
          created_at: string
          id: string
          topic_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          content: string
          created_at?: string
          id?: string
          topic_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attachments?: Json | null
          content?: string
          created_at?: string
          id?: string
          topic_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_comments_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "forum_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_subtopics: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      forum_topics: {
        Row: {
          attachments: Json | null
          created_at: string
          description: string
          id: string
          subtopic_id: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string
          description: string
          id?: string
          subtopic_id?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string
          description?: string
          id?: string
          subtopic_id?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_topics_subtopic_id_fkey"
            columns: ["subtopic_id"]
            isOneToOne: false
            referencedRelation: "forum_subtopics"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_votes: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          id: string
          user_id: string
          vote_type: string
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string
          id?: string
          user_id: string
          vote_type: string
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: []
      }
      glacier_alerts: {
        Row: {
          alert_type: string
          id: string
          last_notified_at: string | null
          subscribed_at: string
          user_id: string
        }
        Insert: {
          alert_type: string
          id?: string
          last_notified_at?: string | null
          subscribed_at?: string
          user_id: string
        }
        Update: {
          alert_type?: string
          id?: string
          last_notified_at?: string | null
          subscribed_at?: string
          user_id?: string
        }
        Relationships: []
      }
      menu_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          restaurant_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          restaurant_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          restaurant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_categories_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          dietary_info: Json | null
          id: string
          image_url: string | null
          is_available: boolean | null
          name: string
          preparation_time: number | null
          price: number
          restaurant_id: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          dietary_info?: Json | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name: string
          preparation_time?: number | null
          price: number
          restaurant_id: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          dietary_info?: Json | null
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          name?: string
          preparation_time?: number | null
          price?: number
          restaurant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_items_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          order_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          order_id?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          order_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          menu_item_id: string
          order_id: string
          quantity: number
          special_requests: string | null
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          menu_item_id: string
          order_id: string
          quantity?: number
          special_requests?: string | null
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          menu_item_id?: string
          order_id?: string
          quantity?: number
          special_requests?: string | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          actual_delivery_time: string | null
          created_at: string
          delivery_fee: number
          delivery_latitude: number | null
          delivery_location: string
          delivery_longitude: number | null
          estimated_delivery_time: string | null
          id: string
          order_number: string
          payment_method: string | null
          payment_status: string | null
          pickup_latitude: number | null
          pickup_location: string
          pickup_longitude: number | null
          restaurant_id: string
          rider_id: string | null
          special_instructions: string | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          actual_delivery_time?: string | null
          created_at?: string
          delivery_fee: number
          delivery_latitude?: number | null
          delivery_location: string
          delivery_longitude?: number | null
          estimated_delivery_time?: string | null
          id?: string
          order_number: string
          payment_method?: string | null
          payment_status?: string | null
          pickup_latitude?: number | null
          pickup_location: string
          pickup_longitude?: number | null
          restaurant_id: string
          rider_id?: string | null
          special_instructions?: string | null
          status?: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          actual_delivery_time?: string | null
          created_at?: string
          delivery_fee?: number
          delivery_latitude?: number | null
          delivery_location?: string
          delivery_longitude?: number | null
          estimated_delivery_time?: string | null
          id?: string
          order_number?: string
          payment_method?: string | null
          payment_status?: string | null
          pickup_latitude?: number | null
          pickup_location?: string
          pickup_longitude?: number | null
          restaurant_id?: string
          rider_id?: string | null
          special_instructions?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      project_components: {
        Row: {
          component_id: string
          created_at: string | null
          id: string
          layer: string
          project_id: string
          properties: Json | null
          rotation: number | null
          updated_at: string | null
          x_position: number
          y_position: number
        }
        Insert: {
          component_id: string
          created_at?: string | null
          id?: string
          layer: string
          project_id: string
          properties?: Json | null
          rotation?: number | null
          updated_at?: string | null
          x_position: number
          y_position: number
        }
        Update: {
          component_id?: string
          created_at?: string | null
          id?: string
          layer?: string
          project_id?: string
          properties?: Json | null
          rotation?: number | null
          updated_at?: string | null
          x_position?: number
          y_position?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_components_component_id_fkey"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_components_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          thumbnail_url: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          thumbnail_url?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          thumbnail_url?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      promotions: {
        Row: {
          applicable_restaurants: string[] | null
          created_at: string
          current_uses: number | null
          description: string | null
          discount_type: string
          discount_value: number
          end_date: string
          id: string
          is_active: boolean | null
          max_uses: number | null
          minimum_order_amount: number | null
          promo_code: string | null
          start_date: string
          title: string
        }
        Insert: {
          applicable_restaurants?: string[] | null
          created_at?: string
          current_uses?: number | null
          description?: string | null
          discount_type: string
          discount_value: number
          end_date: string
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          minimum_order_amount?: number | null
          promo_code?: string | null
          start_date: string
          title: string
        }
        Update: {
          applicable_restaurants?: string[] | null
          created_at?: string
          current_uses?: number | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          end_date?: string
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          minimum_order_amount?: number | null
          promo_code?: string | null
          start_date?: string
          title?: string
        }
        Relationships: []
      }
      research_submissions: {
        Row: {
          abstract: string
          authors: string
          created_at: string
          id: string
          research_link: string
          status: string
          submitted_by: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          abstract: string
          authors: string
          created_at?: string
          id?: string
          research_link: string
          status?: string
          submitted_by: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          abstract?: string
          authors?: string
          created_at?: string
          id?: string
          research_link?: string
          status?: string
          submitted_by?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      restaurants: {
        Row: {
          campus_location: string | null
          category: string
          contact_phone: string | null
          created_at: string
          delivery_fee: number | null
          delivery_time_max: number | null
          delivery_time_min: number | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          minimum_order: number | null
          name: string
          operating_hours: Json | null
          rating: number | null
          updated_at: string
        }
        Insert: {
          campus_location?: string | null
          category?: string
          contact_phone?: string | null
          created_at?: string
          delivery_fee?: number | null
          delivery_time_max?: number | null
          delivery_time_min?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          minimum_order?: number | null
          name: string
          operating_hours?: Json | null
          rating?: number | null
          updated_at?: string
        }
        Update: {
          campus_location?: string | null
          category?: string
          contact_phone?: string | null
          created_at?: string
          delivery_fee?: number | null
          delivery_time_max?: number | null
          delivery_time_min?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          minimum_order?: number | null
          name?: string
          operating_hours?: Json | null
          rating?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string
          delivery_rating: number | null
          delivery_review: string | null
          id: string
          order_id: string
          restaurant_id: string
          restaurant_rating: number | null
          restaurant_review: string | null
          rider_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          delivery_rating?: number | null
          delivery_review?: string | null
          id?: string
          order_id: string
          restaurant_id: string
          restaurant_rating?: number | null
          restaurant_review?: string | null
          rider_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          delivery_rating?: number | null
          delivery_review?: string | null
          id?: string
          order_id?: string
          restaurant_id?: string
          restaurant_rating?: number | null
          restaurant_review?: string | null
          rider_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      traces: {
        Row: {
          created_at: string | null
          id: string
          layer: string
          net_name: string | null
          points: Json
          project_id: string
          updated_at: string | null
          width: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          layer: string
          net_name?: string | null
          points: Json
          project_id: string
          updated_at?: string | null
          width: number
        }
        Update: {
          created_at?: string | null
          id?: string
          layer?: string
          net_name?: string | null
          points?: Json
          project_id?: string
          updated_at?: string | null
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "traces_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string
          default_delivery_latitude: number | null
          default_delivery_location: string | null
          default_delivery_longitude: number | null
          dietary_restrictions: string[] | null
          favorite_restaurants: string[] | null
          id: string
          meal_plan_id: string | null
          notification_preferences: Json | null
          student_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          default_delivery_latitude?: number | null
          default_delivery_location?: string | null
          default_delivery_longitude?: number | null
          dietary_restrictions?: string[] | null
          favorite_restaurants?: string[] | null
          id?: string
          meal_plan_id?: string | null
          notification_preferences?: Json | null
          student_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          default_delivery_latitude?: number | null
          default_delivery_location?: string | null
          default_delivery_longitude?: number | null
          dietary_restrictions?: string[] | null
          favorite_restaurants?: string[] | null
          id?: string
          meal_plan_id?: string | null
          notification_preferences?: Json | null
          student_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          badges: string[] | null
          bio: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          karma: number
          location: string | null
          preferred_auth: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          badges?: string[] | null
          bio?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          karma?: number
          location?: string | null
          preferred_auth?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          badges?: string[] | null
          bio?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          karma?: number
          location?: string | null
          preferred_auth?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_vote: {
        Args: {
          p_content_id: string
          p_content_type: string
          p_user_id: string
          p_vote_type: string
        }
        Returns: boolean
      }
      admin_delete_comment: {
        Args: { comment_id_param: string }
        Returns: boolean
      }
      admin_delete_topic: {
        Args: { topic_id: number } | { topic_id_param: string }
        Returns: boolean
      }
      check_table_exists: {
        Args: { table_name: string }
        Returns: boolean
      }
      create_forum_tables: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: { user_id_param?: string }
        Returns: boolean
      }
      remove_vote: {
        Args: {
          p_content_id: string
          p_content_type: string
          p_user_id: string
        }
        Returns: boolean
      }
      update_user_karma: {
        Args:
          | Record<PropertyKey, never>
          | { user_id_param: string; karma_change: number }
        Returns: undefined
      }
      update_vote: {
        Args:
          | Record<PropertyKey, never>
          | {
              p_content_id: string
              p_content_type: string
              p_user_id: string
              p_vote_type: string
            }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
