import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Form, FormContent, FormGroup } from "../ui/form";
import { Input } from "../ui/Input";
import { Label } from "../ui/label";
import { PasswordInput } from "../ui/password-input";
import { ROUTES } from "../../router/routes";
import { useLogin } from "../../queries/auth";
import { FrontendErrorHandler } from "../../utils/errorHandler";

const LoginForm = () => {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useLogin();

  const onSubmit = (data: { email: string; password: string }) => {
    mutate(data, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  return (
    <Form onSubmit={onSubmit}>
      {({ register, formState: { errors }, setError }) => {
        // Set field errors from API response
        React.useEffect(() => {
          if (error) {
            const fieldErrors = FrontendErrorHandler.extractFieldErrors(error);
            Object.entries(fieldErrors).forEach(([field, message]) => {
              setError(field as keyof typeof errors, { message });
            });
          }
        }, [error, setError]);

        return (
          <FormContent className="gap-5">
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Enter your email"
                {...register("email")}
                error={errors.email?.message}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                {...register("password")}
                placeholder="Enter your password"
                error={errors.password?.message}
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
        );
      }}
    </Form>
  );
};

export default LoginForm;
