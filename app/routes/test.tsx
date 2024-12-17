import { Form } from "@remix-run/react";

export default function MyPage() {
  return (
    <div>
      <Form method="post" action="/create-user">
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" />
        <button type="submit">Submit</button>
      </Form>
      <Form method="post" action="/submit-feedback">
        <label htmlFor="feedback">Feedback:</label>
        <textarea id="feedback" name="feedback"></textarea>
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
}