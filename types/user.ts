export type User = {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: string;
  status: "active" | "inactive";
};

export type FilterParams = {
  page?: number;
  limit?: number;
  status?: "active" | "inactive" | undefined;
  role?: string;
  sortBy?: keyof User;
  sortOrder?: "asc" | "desc";
  search?: string;
};

export type GetUsersResponse = {
  status: string;
  data: {
    users: User[];
    limit: number;
    total_users: number;
    total_pages: number;
    current_page: number;
    message: string;
  };
};
