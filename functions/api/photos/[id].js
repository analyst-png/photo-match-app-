// DELETE /api/photos/:id -> remove a single photo

export async function onRequestDelete({ env, params }) {
  try {
    const id = params.id;
    await env.DB.prepare("DELETE FROM photos WHERE id = ?").bind(id).run();
    return new Response(null, { status: 204 });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
