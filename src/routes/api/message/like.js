/**
 *
 * @param {*} param0
 */
export async function PUT({ request, params }) {
  if (params?.id?.length < 1) {
    return { body: { error: "No ID" } };
  }
  const { user, message } = await request.json();
  if (!authenticate(user?.token, user?.userId)) {
    return { body: { error: "Not logged in" } };
  }
  const dbError = await initDb();
  if (dbError) {
    return { body: { error: dbError } };
  }

  try {
    const mess = await Message.findById(params.id);
    if (!user?.admin) {
      if (mess?.userId !== user?.userId) {
        return { body: { error: "Not message owner" } };
      }
    }
    if (mess.imageUrl.length && mess.imageUrl !== message.imageUrl) {
      unlinkSync(`static${mess.imageUrl}`);
    }
    const updatedMessage = await Message.findByIdAndUpdate(params.id, message);
    return {
      body: { message: updatedMessage, error: null }
    };
  } catch (error) {
    return {
      body: { error: error.message }
    };
  }
}
