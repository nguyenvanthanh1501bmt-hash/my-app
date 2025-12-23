import { Clerk } from "@clerk/clerk-sdk-node";

const clerkClient = new Clerk({ apiKey: process.env.CLERK_SECRET_KEY });

export async function POST(req) {
  try {
    const { name } = await req.json();

    if (!name) {
      return new Response(JSON.stringify({ message: "Missing name" }), { status: 400 });
    }

    // Tìm user theo name (hoặc email)
    const users = await clerkClient.users.getUserList({ query: name });
    if (users.length === 0) {
      return new Response(JSON.stringify({ message: "User not found on Clerk" }), { status: 404 });
    }

    // Xóa user đầu tiên tìm được (hoặc bạn có thể lặp qua tất cả)
    await clerkClient.users.deleteUser(users[0].id);

    return new Response(JSON.stringify({ message: "User deleted successfully on Clerk" }), { status: 200 });
  } catch (err) {
    console.error("Clerk deletion failed:", err);
    return new Response(
      JSON.stringify({ message: `Clerk deletion failed: ${err.message}` }),
      { status: 500 }
    );
  }
}
