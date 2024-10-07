import { getOSList } from '../../util/api';

export async function get({ params, request }) {
  try {
    const osList = await getOSList();
    return new Response(JSON.stringify(osList), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
