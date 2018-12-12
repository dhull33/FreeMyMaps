// Get sign up form data and submit to backend
const sendNewUser = () => {
  return $('#signupForm').on('submit', (event) => {
    event.preventDefault();
    console.log(event);
  });
};
sendNewUser();
