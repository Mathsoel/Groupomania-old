import { verifyToken } from "$lib/token";

export async function POST({ request }) {
  try {
    const { token } = await request.json();
    const payload = await verifyToken(token);
    return {
      body: payload
    };
  } catch (err) {
    return {
      body: { err }
    };
  }
}
