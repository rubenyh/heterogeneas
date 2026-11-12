// src/app/signup/page.jsx

import {
  getLoggedInUser
} from "@/lib/server/appwrite";

import { ID } from "node-appwrite";
import { createAdminClient } from "@/lib/server/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signUpWithGithub } from "@/lib/server/oauth";

async function signUpWithEmail(formData) {
  "use server";

  const email = formData.get("email");
  const password = formData.get("password");
  const name = formData.get("name");

  const { account } = await createAdminClient();

  await account.create({
    userId: ID.unique(),
    email,
    password,
    name
  });
  const session = await account.createEmailPasswordSession({
    email,
    password
  });

  (await cookies()).set("my-custom-session", session.secret, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: true,
  });

  redirect("/account");
}

export default async function SignUpPage() {
  const user = await getLoggedInUser();
  if (user) redirect("/account");

 return (
  <section className="signup-page" aria-labelledby="signup-title">
    <div className="signup-card">
      <h1 id="signup-title">Create your account</h1>

      <form className="signup-form" action={signUpWithEmail}>
        <div className="signup-field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" autoComplete="name" />
        </div>

        <div className="signup-field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" />
        </div>

        <div className="signup-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            minLength={8}
            autoComplete="new-password"
            aria-describedby="signup-password-hint"
          />
          <p id="signup-password-hint">Use at least 8 characters.</p>
        </div>

        <button className="signup-primary" type="submit">
          Sign up
        </button>
      </form>

      <div className="signup-divider" aria-hidden="true">or</div>

      <form action={signUpWithGithub}>
        <button className="signup-secondary" type="submit">
          Sign up with GitHub
        </button>
      </form>
    </div>

    <style>{`
      .signup-page {
        display: grid;
        place-items: center;
        min-height: 100svh;
        box-sizing: border-box;
        padding: 24px 16px;
        background: #f7f7f8;
        color: #18181b;
        font-family: system-ui, sans-serif;
      }

      .signup-page .signup-card {
        box-sizing: border-box;
        width: min(100%, 420px);
        padding: clamp(24px, 6vw, 36px);
        border: 1px solid #e4e4e7;
        border-radius: 20px;
        background: #fff;
        box-shadow: 0 8px 28px rgb(24 24 27 / 5%);
      }

      .signup-page h1 {
        margin: 0 0 28px;
        font-size: clamp(1.5rem, 5vw, 1.875rem);
        font-weight: 650;
        letter-spacing: -0.04em;
        line-height: 1.2;
      }

      .signup-page .signup-form {
        display: grid;
        gap: 18px;
      }

      .signup-page .signup-field {
        display: grid;
        gap: 6px;
      }

      .signup-page label {
        font-size: 0.875rem;
        font-weight: 600;
      }

      .signup-page input,
      .signup-page button {
        box-sizing: border-box;
        width: 100%;
        min-height: 46px;
        padding: 10px 12px;
        border: 1px solid #a1a1aa;
        border-radius: 8px;
        font: inherit;
      }

      .signup-page input {
        min-width: 0;
        background: #fff;
        color: #18181b;
      }

      .signup-page input:focus-visible,
      .signup-page button:focus-visible {
        outline: 2px solid #2563eb;
        outline-offset: 2px;
      }

      .signup-page .signup-field p {
        margin: 0;
        color: #52525b;
        font-size: 0.8125rem;
      }

      .signup-page button {
        cursor: pointer;
        font-weight: 600;
      }

      .signup-page .signup-primary {
        border-color: #18181b;
        background: #18181b;
        color: #fff;
      }

      .signup-page .signup-primary:hover {
        background: #3f3f46;
      }

      .signup-page .signup-secondary {
        background: #fff;
        color: #18181b;
      }

      .signup-page .signup-secondary:hover {
        background: #f4f4f5;
      }

      .signup-page .signup-divider {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 20px 0;
        color: #52525b;
        font-size: 0.8125rem;
      }

      .signup-page .signup-divider::before,
      .signup-page .signup-divider::after {
        flex: 1;
        height: 1px;
        background: #e4e4e7;
        content: "";
      }
    `}</style>
  </section>
);
}
