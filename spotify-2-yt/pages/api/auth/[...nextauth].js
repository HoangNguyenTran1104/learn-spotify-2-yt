import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import {LOGIN_URL} from "../../../lib/spotify"

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_ID,
      authorization: LOGIN_URL
    }),
    // ...add more providers here 
  ],
  secret: process.env.JWT_SECRET,
  pages:{
    signIn:'/login'
  },
  callbacks:{
    async jwt({token, account,user}){

      // initial sign in
      if(account && user){
        return {
          ...token, 
          accessToken: account.access_token, 
          refreshToken: account.refresh_token, 
          username: account.providerAccountId, 
          accessTokenExpires: account.expires_at * 1000 // we are handling expiry times in Miliseconds hence * 1000
        }
      }

      // Return previous token if the access token has not expired
      if(Date.now() < token.accessTokenExpires){
        return token;
      }

      //Access token has
    }
  }


})