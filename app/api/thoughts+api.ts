export async function GET(request: Request) {
  try {
    const { prisma } = await import('@/lib/prisma');
    
    const thoughts = await prisma.thought.findMany({
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedThoughts = thoughts.map(thought => ({
      ...thought,
      likeCount: thought._count.likes,
      commentCount: thought._count.comments,
      isLiked: false, // Will be updated based on current user
    }));

    return new Response(JSON.stringify(formattedThoughts), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching thoughts:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch thoughts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request: Request) {
  try {
    const { content, userId } = await request.json();

    if (!content || !userId) {
      return new Response(JSON.stringify({ error: 'Content and userId are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { prisma } = await import('@/lib/prisma');
    
    const thought = await prisma.thought.create({
      data: {
        content,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    const formattedThought = {
      ...thought,
      likeCount: thought._count.likes,
      commentCount: thought._count.comments,
      isLiked: false,
    };

    return new Response(JSON.stringify(formattedThought), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating thought:', error);
    return new Response(JSON.stringify({ error: 'Failed to create thought' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}