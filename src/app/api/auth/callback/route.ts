import { NextResponse } from 'next/server';
import { AUTH_CONFIG } from '@/config/auth';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/auth/error', request.url));
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch(AUTH_CONFIG.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: AUTH_CONFIG.clientId,
        client_secret: AUTH_CONFIG.clientSecret,
        code,
        redirect_uri: AUTH_CONFIG.redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();
    const { access_token } = tokenData;

    // Get user info and cloud ID
    const userResponse = await fetch(AUTH_CONFIG.userInfoUrl, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to get user info');
    }

    const userData = await userResponse.json();
    const cloudId = userData[0].id;

    // Return success page with user data
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Successful</title>
        </head>
        <body>
          <script>
            window.opener.postMessage(
              {
                type: 'AUTH_SUCCESS',
                user: ${JSON.stringify({
                  id: userData[0].id,
                  name: userData[0].name,
                  email: userData[0].email,
                  picture: userData[0].picture,
                  accessToken: access_token,
                  cloudId,
                })}
              },
              '*'
            );
            window.close();
          </script>
        </body>
      </html>
      `,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.redirect(new URL('/auth/error', request.url));
  }
} 