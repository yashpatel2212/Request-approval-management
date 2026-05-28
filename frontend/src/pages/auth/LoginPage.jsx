import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { loginThunk } from "../../features/auth/authSlice";
import { useAuth } from "../../hooks/useAuth";
import { loginSchema } from "../../utils/validationSchemas";

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user, loading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "employee@yopmail.com", password: "Password123" }
  });

  if (token && user) return <Navigate to={`/${user.role}/dashboard`} replace />;

  const onSubmit = async (values) => {
    try {
      const result = await dispatch(loginThunk(values)).unwrap();
      toast.success("Welcome back");
      navigate(`/${result.user.role}/dashboard`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-royal-50 px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-royal-900">Royal Group</h1>
        <p className="mt-1 text-sm text-slate-500">Request & Approval Management System</p>
        <div className="mt-6 space-y-4">
          <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
          <Input label="Password" type="password" error={errors.password?.message} {...register("password")} />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </Button>
        </div>
        <div className="mt-5 rounded-md bg-slate-50 p-3 text-xs text-slate-600">
          Employee: employee@yopmail.com / Password123<br />
          Manager: manager@yopmail.com / Password123
        </div>
      </form>
    </div>
  );
};
