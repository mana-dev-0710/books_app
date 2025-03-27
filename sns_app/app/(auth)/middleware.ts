import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = { 
  matcher: ["/bookshelf/:path*", "/search/:path*", "/favorites/:path*"] 
};
