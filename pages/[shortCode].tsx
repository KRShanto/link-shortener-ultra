import { useRouter } from "next/router";

export default function RedirectLandingPage() {
  const router = useRouter();
  const { shortCode } = router.query;

  return (
    <>
      <a className="join-free-link" href={`/red/${shortCode}`}>
        Join Free
      </a>
    </>
  );
}

// Set a initialProp `redirectPage` to true
RedirectLandingPage.getInitialProps = () => {
  return {
    redirectPage: true,
  };
};

// export async function getServerSideProps(context) {
//   const { shortCode } = context.query;

//   await dbConnect();

//   // Find the short url in the database
//   // @ts-ignore
//   const shortUrl = await ShortUrl.findOne({
//     shortCode,
//   });

//   console.log("====================================");
//   console.log("The ShortUrl found is: ", shortUrl);
//   console.log("====================================");

//   // If there is no short url with the given short url return 404.
//   // TODO: Redirect to a errorPage included in the short url or
//   if (!shortUrl) {
//     return {
//       notFound: true,
//     };
//   }

//   // Find the user of the short url
//   // @ts-ignore
//   const user = await User.findOne({
//     username: shortUrl.username,
//   });

//   // If the user is not found return 404
//   if (!user) {
//     return {
//       notFound: true,
//     };
//   }

//   // +1 to the clicks
//   shortUrl.clicks += 1;
//   await shortUrl.save();

//   if (shortUrl.clicks % 5 === 0) {
//     if (user.shouldRedirectOnLimit === true) {
//       return {
//         redirect: {
//           destination: shortUrl.errorPage,
//           permanent: true,
//         },
//       };
//     }
//   }

//   // Redirect to the original url
//   return {
//     redirect: {
//       destination: shortUrl.originalUrl,
//       permanent: true,
//     },
//   };
// }
