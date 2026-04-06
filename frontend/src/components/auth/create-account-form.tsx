import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Form, FormContent, FormGroup } from "../ui/form";
import { Input } from "../ui/Input";
import { Label } from "../ui/label";
import { PasswordInput } from "../ui/password-input";
import { ROUTES } from "../../router/routes";
import { useSignup } from "../../queries/auth";

const CreateAccountForm = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useSignup();

  const onSubmit = (data: {
    email: string;
    password: string;
    username: string;
  }) => {
    mutate(data, {
      onSuccess: (res) => {
        localStorage.setItem("token", res.token);
        navigate("/login");
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
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Enter your username"
              {...register("username")}
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
            Sign up
          </Button>
          <div className="flex items-center justify-center gap-2 mt-2">
            <p className="text-14 text-text-default-tertiary">{`Already have an account?`}</p>
            <Link
              to={ROUTES.LOGIN}
              className="text-sm font-medium text-text-primary hover:text-text-primary-hover underline underline-offset-4"
            >
              Login
            </Link>
          </div>
        </FormContent>
      )}
    </Form>
  );
};

export default CreateAccountForm;
