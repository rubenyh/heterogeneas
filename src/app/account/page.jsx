// src/app/account/page.jsx

import {
  createSessionClient,
  getLoggedInUser,
} from "@/lib/server/appwrite";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

async function signOut() {
  "use server";

  const { account } = await createSessionClient();

  (await cookies()).delete("my-custom-session");
  await account.deleteSession({ sessionId: "current" });

  redirect("/signup");
}

export default async function HomePage() {
  const user = await getLoggedInUser();
  if (!user) redirect("/signup");

return (
  <section className="account-page" aria-labelledby="account-title">
    <div className="account-card">
      <h1 id="account-title">Your account</h1>

      <dl className="account-details">
        <div>
          <dt>Name</dt>
          <dd>{user.name}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt>Account ID</dt>
          <dd><code>{user.$id}</code></dd>
        </div>
      </dl>

      <form action={signOut}>
        <button type="submit">Sign out</button>
      </form>
    </div>

    <style>{`
      .account-page {
        display: grid;
        place-items: center;
        min-height: 100svh;
        box-sizing: border-box;
        padding: 24px 16px;
        background: #f7f7f8;
        color: #18181b;
        font-family: system-ui, sans-serif;
      }

      .account-page .account-card {
        box-sizing: border-box;
        width: min(100%, 420px);
        padding: clamp(24px, 6vw, 36px);
        border: 1px solid #e4e4e7;
        border-radius: 20px;
        background: #fff;
        box-shadow: 0 8px 28px rgb(24 24 27 / 5%);
      }

      .account-page h1 {
        margin: 0 0 16px;
        font-size: clamp(1.5rem, 5vw, 1.875rem);
        font-weight: 650;
        letter-spacing: -0.04em;
        line-height: 1.2;
      }

      .account-page .account-details {
        margin: 0 0 24px;
      }

      .account-page .account-details > div {
        display: grid;
        gap: 4px;
        padding: 14px 0;
        border-bottom: 1px solid #e4e4e7;
      }

      .account-page dt {
        color: #52525b;
        font-size: 0.8125rem;
        font-weight: 600;
      }

      .account-page dd {
        margin: 0;
        overflow-wrap: anywhere;
      }

      .account-page code {
        font-size: 0.875rem;
      }

      .account-page button {
        width: 100%;
        min-height: 46px;
        padding: 10px 12px;
        border: 1px solid #a1a1aa;
        border-radius: 8px;
        background: #fff;
        color: #18181b;
        cursor: pointer;
        font: inherit;
        font-weight: 600;
      }

      .account-page button:hover {
        background: #f4f4f5;
      }

      .account-page button:focus-visible {
        outline: 2px solid #2563eb;
        outline-offset: 2px;
      }
    `}</style>
  </section>
  );
}
