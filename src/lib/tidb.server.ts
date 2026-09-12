import { connect } from "@tidbcloud/serverless";

export type TidbRow = Record<string, unknown>;

type TidbResult = {
  rows?: unknown;
  rowsAffected?: number | string | null;
  rowCount?: number;
};

let databaseUrl: string | undefined;

function getDatabaseUrl(): string {
  databaseUrl ??= process.env["DATABASE_URL"]?.trim();
  if (!databaseUrl) {
    throw new Error("Missing DATABASE_URL environment variable for TiDB Cloud");
  }
  return databaseUrl;
}

export async function queryRows<T extends TidbRow = TidbRow>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  const result = (await connect({ url: getDatabaseUrl() }).execute(
    sql,
    params,
  )) as unknown;

  if (Array.isArray(result)) return result as T[];
  if (isTidbResult(result) && Array.isArray(result.rows)) {
    return result.rows as T[];
  }
  return [];
}

export async function executeSql(
  sql: string,
  params: unknown[] = [],
): Promise<{ affectedRows: number }> {
  const result = (await connect({ url: getDatabaseUrl() }).execute(
    sql,
    params,
    { fullResult: true },
  )) as unknown;

  if (!isTidbResult(result)) return { affectedRows: 0 };
  const affectedRows = result.rowsAffected ?? result.rowCount ?? 0;
  return { affectedRows: Number(affectedRows) || 0 };
}

export function isDuplicateKeyError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const candidate = error as {
    code?: unknown;
    errno?: unknown;
    message?: unknown;
    details?: { code?: unknown } | null;
  };
  return (
    candidate.code === "ER_DUP_ENTRY" ||
    candidate.details?.code === "ER_DUP_ENTRY" ||
    candidate.errno === 1062 ||
    (typeof candidate.message === "string" &&
      candidate.message.includes("Duplicate entry"))
  );
}

function isTidbResult(value: unknown): value is TidbResult {
  return Boolean(value && typeof value === "object");
}
