export async function POST(request: Request, { id }: { id: string }) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: 'UserId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { prisma } = await import('@/lib/prisma');
    
    // Check if like already exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_thoughtId: {
          userId,
          thoughtId: id,
        },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: {
          userId_thoughtId: {
            userId,
            thoughtId: id,
          },
        },
      });
    } else {
      // Like
      await prisma.like.create({
        data: {
          userId,
          thoughtId: id,
        },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    return new Response(JSON.stringify({ error: 'Failed to toggle like' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}