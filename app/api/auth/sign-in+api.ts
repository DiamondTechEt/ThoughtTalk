export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { authenticateUser, generateToken } = await import('@/lib/auth');
    
    const user = await authenticateUser(email, password);
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid email or password' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = generateToken(user.id);

    return new Response(JSON.stringify({ user, token }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Sign in error:', error);
    return new Response(JSON.stringify({ error: 'Failed to sign in' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}