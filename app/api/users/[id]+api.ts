export async function PUT(request: Request, { id }: { id: string }) {
  try {
    const { displayName, bio } = await request.json();

    const { prisma } = await import('@/lib/prisma');
    
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(displayName !== undefined && { displayName }),
        ...(bio !== undefined && { bio }),
      },
      select: {
        id: true,
        email: true,
        displayName: true,
        bio: true,
      },
    });

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return new Response(JSON.stringify({ error: 'Failed to update user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}