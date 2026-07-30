export interface TeamMember {
  _id: string;
  id: string;
  user_id: string;
  team_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  avatar: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface AddTeamMemberRequest {
  teamId: string;
  first_name: string;
  last_name?: string;
  email: string;
  password?: string;
  phone_number: string;
  avatar?: string | null;
  status?: 'active' | 'inactive';
}

export interface RemoveTeamMemberRequest {
  teamId: string;
  memberIds: string[];
}

export interface RemoveTeamMemberResponse {
  success: boolean;
  message: string;
  data: {
    removedCount: number;
    notFoundCount: number;
    successful: string[];
    notFound: string[];
  }
}
