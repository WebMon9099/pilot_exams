import { useNavigate, useRouteError } from 'react-router-dom';
import { Button } from '../components';

const RouteErrorPage: React.FC = () => {
  const navigate = useNavigate();

  const error = useRouteError();
  console.error(error);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-16 px-4 py-6 text-center text-theme-extra-dark-gray">
      <p className="text-3xl font-semibold text-theme-medium-gray">
        You cannot access this page directly.
      </p>
      <Button className="bg-theme-medium-gray" onClick={() => navigate(-1)}>
        Go back to Activities
      </Button>
    </main>
  );
};

export default RouteErrorPage;
