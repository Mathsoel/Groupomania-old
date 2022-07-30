export async function DELETE({ request, params }) {
  if (params?.id?.length < 1) {
    return { body: { error: "No ID" } };
  }
  try {
    if (!user?.admin) {
      const message = await Message.findById(params.id);
      if (message?.userId !== user?.userId) {
        return { body: { error: "Not message owner" } };
      }
    }
    await Message.findByIdAndDelete(params.id);
    return {
      body: { error: null }
    };
  } catch (error) {
    return {
      body: { error: error.message }
    };
  }
}
