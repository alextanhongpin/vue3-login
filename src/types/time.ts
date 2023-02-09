export async function sleep(ms = 1_000) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}
