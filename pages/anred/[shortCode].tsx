import { useEffect } from "react";
import dbConnect from "../../lib/dbConnect";
import ShortUrl from "../../models/ShortUrl";
import User from "../../models/User";
import { useRouter } from "next/router";

export default function RedirectPage({ url }: any) {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push(url);
    }, 3000);
  }, []);

  return (
    <>
      <h1>Joining my profile</h1>
    </>
  );
}

export async function getServerSideProps(context) {
  const { shortCode } = context.query;

  await dbConnect();

  // Find the short url in the database
  // @ts-ignore
  const shortUrl = await ShortUrl.findOne({
    shortCode,
  });

  console.log("====================================");
  console.log("The ShortUrl found is: ", shortUrl);
  console.log("====================================");

  // If there is no short url with the given short url return 404.
  // TODO: Redirect to a errorPage included in the short url or
  if (!shortUrl) {
    return {
      notFound: true,
    };
  }

  // Find the user of the short url
  // @ts-ignore
  const user = await User.findOne({
    username: shortUrl.username,
  });

  // If the user is not found return 404
  if (!user) {
    return {
      notFound: true,
    };
  }

  // +1 to the clicks
  shortUrl.clicks += 1;
  await shortUrl.save();

  if (shortUrl.clicks % 5 === 0) {
    if (user.shouldRedirectOnLimit === true) {
      return {
        redirect: {
          destination: shortUrl.errorPage,
          permanent: true,
        },
      };
    }
  }

  // Redirect to the original url
  return {
    // redirect: {
    //   destination: shortUrl.originalUrl,
    //   permanent: true,
    // },

    props: {
      url: shortUrl.originalUrl,
    },
  };
}
