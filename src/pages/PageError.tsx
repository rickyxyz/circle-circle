import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

function PageError() {
  const error = useRouteError();
  // eslint-disable-next-line no-console
  console.log(error);
  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.status.toString();
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = 'Something went wrong';
  }

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <h2>{errorMessage}</h2>
      <p>Sorry, an unexpected error has occurred.</p>
    </div>
  );
}

export default PageError;
