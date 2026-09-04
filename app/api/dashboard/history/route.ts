import { list } from "@vercel/blob";
import { defaultDashboard, type DashboardPayload } from "../../../../lib/dashboard-data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json({ periods: [{ referenceDate: defaultDashboard.referenceDate, updatedAt: defaultDashboard.updatedAt }] }, { headers: { "Cache-Control": "no-store" } });
  }

  try {
    const { searchParams } = new URL(request.url);
    const requestedDate = searchParams.get("date");
    const result = await list({ prefix: "dashboard/history/", limit: 100 });
    const loaded = await Promise.allSettled(
      result.blobs.map(async (blob) => {
        const response = await fetch(blob.url, { cache: "no-store" });
        if (!response.ok) throw new Error("Falha ao ler histórico");
        return await response.json() as DashboardPayload;
      }),
    );
    const dashboards = loaded
      .filter((item): item is PromiseFulfilledResult<DashboardPayload> => item.status === "fulfilled")
      .map((item) => item.value)
      .filter((item) => item.referenceDate && item.categories?.length)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    const unique = [...new Map([defaultDashboard, ...dashboards].map((item) => [item.referenceDate, item])).values()]
      .sort((a, b) => b.referenceDate.localeCompare(a.referenceDate));

    if (requestedDate) {
      const dashboard = unique.find((item) => item.referenceDate === requestedDate);
      return dashboard
        ? Response.json(dashboard, { headers: { "Cache-Control": "no-store" } })
        : Response.json({ error: "Período não encontrado." }, { status: 404 });
    }

    return Response.json({
      periods: unique.map(({ referenceDate, updatedAt }) => ({ referenceDate, updatedAt })),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ periods: [{ referenceDate: defaultDashboard.referenceDate, updatedAt: defaultDashboard.updatedAt }] }, { headers: { "Cache-Control": "no-store" } });
  }
}
