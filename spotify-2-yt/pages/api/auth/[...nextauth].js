import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import spotifyAPI,{LOGIN_URL} from "../../../lib/spotify"

async function refreshAccessToken(token){
  try{
    spotifyAPI.setAccessToken(token.accessToken)
    spotifyAPI.setRefreshToken(token.refreshToken)

    const {body: refreshedToken} = await spotifyAPI.refreshAccessToken()
    console.log("REFRESHED TOKEN IS ", refreshedToken)
    return{
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now + refreshToken.expires_in * 1000, // = 1 hour 3600 return from Spotify API
      refreshToken: refreshedToken.refresh_token ?? token.refresh_token // replace if new one came back else fall back to old refresh token
    }

  }
  catch(error){
    console.error(error)
    return{
      ... token, 
      error: "RefrshAccessToken"
    };

  }
}

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
        console.log("EXISTING ACCESS TOKEN IS VALID")
        return token
      }

      //Access token has expired, so we need to refresh it...
      console.log("ACCESS TOKEN HAS EXPIRED, REFRESHING...");
      return await refreshAccessToken(token)
    },

    async session({ session,token}){
      session.user.accessToken = token.accessToken;
      session.user.refreshToken = token.refreshToken;
       session.user.username = token.username;

      return session
    }
  }


})