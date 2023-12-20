export interface ButtonProps {
  variant: string;
  text: string;
}

const Button = ({ variant, text }: ButtonProps) => {
  return (
    <div>
      {variant}-{text}
    </div>
  );
};

export default Button;
