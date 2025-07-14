export async function PUT(request: Request, { id }: { id: string }) {
  try {
    const { content } = await request.json();

    if (!content) {
      return new Response(JSON.stringify({ error: 'Content is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { prisma } = await import('@/lib/prisma');
    
    const thought = await prisma.thought.update({
      where: { id },
      data: { content },
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
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating thought:', error);
    return new Response(JSON.stringify({ error: 'Failed to update thought' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request: Request, { id }: { id: string }) {
  try {
    const { prisma } = await import('@/lib/prisma');
    
    await prisma.thought.delete({
      where: { id },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting thought:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete thought' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}