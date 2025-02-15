import { SiteHeader } from "@/components/layouts/site-header";
import { searchParamsCache } from "@/lib/search-params";
import { SearchParams } from "nuqs";
import DataListing from "./components/data-table/data-listing";
import { UsersDialogs } from "./components/dialogs/users-dialog";
import UsersProviders from "./context/users-context";

type pageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function UsersPage(props: pageProps) {
  const searchParams = await props.searchParams;
  searchParamsCache.parse(searchParams);

  return (
    <UsersProviders>
      <SiteHeader />
      <div className="flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0 mt-4">
        <DataListing />
      </div>
      <UsersDialogs />
    </UsersProviders>
  );
}
