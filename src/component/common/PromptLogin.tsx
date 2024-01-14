import useAuth from '@/hook/useAuth';
import { HTMLAttributes } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PromptLogin({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <div
      className={className}
      {...props}
      onClickCapture={(e) => {
        if (!user) {
          e.preventDefault();
          e.stopPropagation();
          navigate('/account/login');
        }
      }}
    >
      {children}
    </div>
  );
}
