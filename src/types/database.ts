export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      messages: {
        Row: {
          id: string;
          content: string;
          color: string;
          created_at: string;
          first_opened_at: string | null;
          open_count: number;
        };
        Insert: {
          id: string;
          content: string;
          color?: string;
          created_at?: string;
          first_opened_at?: string | null;
          open_count?: number;
        };
        Update: {
          id?: string;
          content?: string;
          color?: string;
          created_at?: string;
          first_opened_at?: string | null;
          open_count?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type MessageRow = Database['public']['Tables']['messages']['Row'];
export type MessageInsert = Database['public']['Tables']['messages']['Insert'];
export type MessageUpdate = Database['public']['Tables']['messages']['Update'];
