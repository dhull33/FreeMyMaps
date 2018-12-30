// Get sign up form data and submit to backend
const sendNewUserBack = () => {
  return $('#signupForm').on('submit', (event) => {
    event.preventDefault();
    console.log(event);
  });
};
