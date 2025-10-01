import { withAuth } from "next-auth/middleware";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // Add any additional middleware logic here if needed
    console.log("Token:", req.nextauth.token?.email);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if user is authenticated for protected routes
        const { pathname } = req.nextUrl;
        
        // Public routes that don't need authentication
        const publicRoutes = [
          '/',
          '/auth/signin',
          '/auth/signup',
          '/api/auth',
          '/api/newsletter'
        ];
        
        // Check if current path starts with any public route
        const isPublicRoute = publicRoutes.some(route => 
          pathname.startsWith(route)
        );
        
        if (isPublicRoute) {
          return true;
        }
        
        // For protected routes, require authentication
        return !!token;
      },
    },
  }
);

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes (excluding /api/auth)
     * 2. /_next (Next.js internals)
     * 3. /favicon.ico, /sitemap.xml, /robots.txt (static files)
     * 4. /images, /icons (static assets)
     */
    "/((?!api(?!/auth)|_next|favicon.ico|sitemap.xml|robots.txt|images|icons).*)",
  ],
};
