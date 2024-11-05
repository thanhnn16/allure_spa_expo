export interface User {
  id: string;
  phone_number: string;
  email: string | null;
  role: string;
  full_name: string;
  gender: string;
  date_of_birth: string | null;
  media_id: string | null;
  loyalty_points: number;
  skin_condition: string | null;
  note: string | null;
  purchase_count: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  avatar_url: string | null;
  media: any | null;
}
