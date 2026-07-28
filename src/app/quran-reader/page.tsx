import { redirect } from "next/navigation";
export default async function Reader({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const page = Number((await searchParams).page ?? 7);
  redirect(
    `/quran-pages/${Number.isInteger(page) && page >= 7 && page <= 610 ? page : 7}`,
  );
}
