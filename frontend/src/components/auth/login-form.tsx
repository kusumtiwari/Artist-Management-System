import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Form, FormContent, FormGroup } from "../ui/form";
import { Input } from "../ui/Input";
import { Label } from "../ui/label";
import { PasswordInput } from "../ui/password-input";
import { ROUTES } from "../../router/routes";

const LoginForm = () => {
  const onSubmit = (data: { email: string; password: string }) => {
    console.log(data, "data");
  };
  return (
    <Form onSubmit={onSubmit}>
      {({ register, formState: { errors } }) => (
        <FormContent className="gap-5">
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="Enter your email" />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              {...register("password")}
              placeholder="Enter your password"
            />
          </FormGroup>

          <Button isLoading={false} type="submit" className="w-full mt-2">
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
