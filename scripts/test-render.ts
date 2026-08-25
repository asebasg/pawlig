import { render } from '@react-email/render';
import { PasswordResetEmail } from '../lib/email/templates/password-reset';

async function test() {
  try {
    const reactElement = PasswordResetEmail({
      userName: "Test User",
      resetUrl: "http://localhost:3000/reset",
    });
    const html = await render(reactElement);
    console.log("RENDER SUCCESS!");
    console.log(html.substring(0, 100));
  } catch (err) {
    console.error("RENDER ERROR:", err);
  }
}
test();
