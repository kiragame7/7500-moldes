export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type ConversionEventRow = {
  id: number
  event_name: string
  event_id: string
  source: "browser" | "hotmart" | "meta_capi"
  transaction_id: string | null
  external_id: string | null
  event_source_url: string | null
  referrer_url: string | null
  event_time: string
  received_at: string
  value: number | null
  currency: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  utm_content: string | null
  utm_term: string | null
  fbclid: string | null
  fbc: string | null
  fbp: string | null
  client_ip_address: string | null
  user_agent: string | null
  provider_status: string | null
  provider_response_id: string | null
  provider_error: string | null
  meta_status: "pending" | "processing" | "accepted" | "failed" | null
  meta_attempts: number
  meta_last_attempt_at: string | null
  request_id: string | null
  payload_hash: string | null
  created_at: string
  updated_at: string
}

type ConversionEventInsert = {
  id?: number
  event_name: string
  event_id: string
  source: "browser" | "hotmart" | "meta_capi"
  transaction_id?: string | null
  external_id?: string | null
  event_source_url?: string | null
  referrer_url?: string | null
  event_time: string
  received_at?: string
  value?: number | null
  currency?: string | null
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
  utm_content?: string | null
  utm_term?: string | null
  fbclid?: string | null
  fbc?: string | null
  fbp?: string | null
  client_ip_address?: string | null
  user_agent?: string | null
  provider_status?: string | null
  provider_response_id?: string | null
  provider_error?: string | null
  meta_status?: "pending" | "processing" | "accepted" | "failed" | null
  meta_attempts?: number
  meta_last_attempt_at?: string | null
  request_id?: string | null
  payload_hash?: string | null
  created_at?: string
  updated_at?: string
}

type ConversionEventUpdate = Partial<ConversionEventInsert>

type PurchaseRow = {
  transaction_id: string
  status: "approved" | "complete" | "refunded" | "chargeback" | "canceled" | "expired"
  approved_at: string | null
  value: number | null
  currency: string | null
  product_id: string | null
  product_name: string | null
  external_id: string | null
  external_id_hash: string | null
  hotmart_event_id: string | null
  meta_event_id: string | null
  meta_events_received: boolean
  meta_error: string | null
  last_webhook_at: string
  created_at: string
  updated_at: string
}

type PurchaseInsert = {
  transaction_id: string
  status: "approved" | "complete" | "refunded" | "chargeback" | "canceled" | "expired"
  approved_at?: string | null
  value?: number | null
  currency?: string | null
  product_id?: string | null
  product_name?: string | null
  external_id?: string | null
  external_id_hash?: string | null
  hotmart_event_id?: string | null
  meta_event_id?: string | null
  meta_events_received?: boolean
  meta_error?: string | null
  last_webhook_at?: string
  created_at?: string
  updated_at?: string
}

type PurchaseUpdate = Partial<PurchaseInsert>

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      conversion_events: {
        Row: ConversionEventRow
        Insert: ConversionEventInsert
        Update: ConversionEventUpdate
        Relationships: []
      }
      purchases: {
        Row: PurchaseRow
        Insert: PurchaseInsert
        Update: PurchaseUpdate
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_conversion_event: {
        Args: { p_event_id: string }
        Returns: { claimed: boolean; current_status: string | null }[]
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
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
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
    ? DatabaseWithoutInternals["public"]["Tables"][DefaultSchemaTableNameOrOptions] extends {
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
