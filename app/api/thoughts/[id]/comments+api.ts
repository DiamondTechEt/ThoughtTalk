export async function GET(request: Request, { id }: { id: string }) {
  try {
    const { prisma } = await import('@/lib/prisma');
    
    const comments = await prisma.comment.findMany({
      where: { thoughtId: id },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return new Response(JSON.stringify(comments), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch comments' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request: Request, { id }: { id: string }) {
  try {
    const { content, userId } = await request.json();

    if (!content || !userId) {
      return new Response(JSON.stringify({ error: 'Content and userId are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { prisma } = await import('@/lib/prisma');
    
    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        thoughtId: id,
      },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
      },
    });

    return new Response(JSON.stringify(comment), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return new Response(JSON.stringify({ error: 'Failed to create comment' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}