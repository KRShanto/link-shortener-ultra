import { useRouter } from "next/router";
import Head from "next/head";
import State from "../models/State";
import dbConnect from "../lib/dbConnect";

export default function RedirectLandingPage({ host, youtubeToken }) {
  const router = useRouter();
  const { shortCode } = router.query;

  const link = `https://www.youtube.com/redirect?event=comments&redir_token=${youtubeToken}&q=${host}/red/${router.query.shortCode}&html_redirect=1`;

  return (
    <>
      <Head>
        <title>Save your images</title>
        <meta name="description" content="free live" />
        <meta name="keywords" content="images, save, share" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="landing-page">
        <a className="btn btn-offer" href={link}>
          Join Free
        </a>
        <img
          style={{
            width: "100%",
            borderRadius: "1.5rem",
            border: ".2rem solid #fff",
          }}
          src="snap-pic.webp"
          alt="snapchat"
        />
      </div>
    </>
  );
}

// Set a initialProp `redirectPage` to true
// RedirectLandingPage.getInitialProps = () => {
//   return {
//     redirectPage: true,
//   };
// };

export async function getServerSideProps(context) {
  // get the origin
  // console.log(context.req.headers.host);

  await dbConnect();

  // @ts-ignore
  const state = await State.findOne({ shortCode: context.query.shortCode });

  console.log(state);

  if (!state) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      host: context.req.headers.host,
      youtubeToken: state.youtubeToken,
      redirectPage: true,
    },
  };
}
