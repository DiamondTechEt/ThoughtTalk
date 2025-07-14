export async function POST(request: Request) {
  try {
    const { email, password, displayName } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { createUser, generateToken } = await import('@/lib/auth');
    
    const user = await createUser(email, password, displayName);
    const token = generateToken(user.id);

    return new Response(JSON.stringify({ user, token }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Sign up error:', error);
    
    if (error.code === 'P2002') {
      return new Response(JSON.stringify({ error: 'An account with this email already exists' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Failed to create account' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}