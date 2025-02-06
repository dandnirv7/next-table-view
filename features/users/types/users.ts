export type User = {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: string;
  status: "active" | "inactive";
};

export type GetUsersResponse = {
  status: string;
  data: {
    users: User[];
    limit: number;
    total_pages: number;
    current_page: number;
    message: string;
  };
};
