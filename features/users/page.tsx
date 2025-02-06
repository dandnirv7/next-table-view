import { SiteHeader } from "@/components/layouts/site-header";
import { getUsers } from "./actions/getUsers";
import { DataTable } from "./components/data-table";
import { columns } from "./components/columns";
import PageContainer from "@/components/page-container";
import { User } from "./types/users";

async function getData(
  page: number = 1,
  perPage: number = 20
): Promise<User[]> {
  const response = await getUsers(page, perPage);
  return response.data.users;
}

export default async function UsersPage() {
  const userList = await getData();

  return (
    <>
      <SiteHeader />
      <PageContainer scrollable={false}>
        <div className="flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0 mt-4">
          <DataTable data={userList} columns={columns} />
        </div>
      </PageContainer>
    </>
  );
}
