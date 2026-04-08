import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Form, FormContent, FormGroup } from "../ui/form";
import { Input } from "../ui/Input";
import { Label } from "../ui/label";
import { PasswordInput } from "../ui/password-input";
import { ROUTES } from "../../router/routes";
import { useLogin } from "../../queries/auth";

const LoginForm = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useLogin();

  const onSubmit = (data: { email: string; password: string }) => {
    mutate(data, {
      onSuccess: (res) => {
        navigate("/");
      },
      onError: (err: any) => {
        console.error(err.message);
      },
    });
  };

  return (
    <Form onSubmit={onSubmit}>
      {({ register, formState: { errors } }) => (
        <FormContent className="gap-5">
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="Enter your email"
              {...register("email")}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              {...register("password")}
              placeholder="Enter your password"
            />
          </FormGroup>

          <Button isLoading={isPending} type="submit" className="w-full mt-2">
            Login
          </Button>
          <div className="flex items-center justify-center gap-2 mt-2">
            <p className="text-14 text-text-default-tertiary">{`Don't have an account?`}</p>
            <Link
              to={ROUTES.REGISTER}
              className="text-sm font-medium text-text-primary hover:text-text-primary-hover underline underline-offset-4"
            >
              Sign up
            </Link>
          </div>
        </FormContent>
      )}
    </Form>
  );
};

export default LoginForm;
